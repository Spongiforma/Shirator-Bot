#|
specification
file structure:
circles/
    circle1/
        R125 name1/
            01file.wav/.mp3
            02file.wav/.mp3
        R324 name2/
        R344 name2/
    circle2/
filenames must only have 1 space
return json:
{
files : [dir1,dir2,dir3,dir4]
}

return thing xml:

<tr>
    <td class="right">1</td>
    <td class="right">104M</td>
    <td class="right">Me</td>
    <td class="right">R1234</td>
    <td class="content" title="Download with: &ltprefix&gt ::play key ${num}"><a href="#" onclick="prompt('Paste into discord:','::play key ${num}')">My neighbour is a vampiric 800 year old loli?</a></td>
</tr>
|#

(ql:quickload "cl-ppcre")
(ql:quickload "osicat")

(defparameter *root-dir* "/Shirator-Discord-Bot/sound/voice/")
(defparameter *sound-files* '(".mp3" ".wav" ".flac" ".ogg"))
(defparameter *out-csv* "catalogue.csv")
(defparameter *out-html* "cathtml.txt")

(defun main ()
  (let ((res (read-all)))
    (apply #'write-to-csv (cons *out-csv* res))
    (apply #'write-to-html (cons *out-html* res))
    (format t "Num of works: ~A~%" (length (car res)))
    (format t "Size of files: ~A~%" (reduce #'+ (car res)))
    (format t "Number of circles ~A~%" (length (remove-duplicates (second res))))))

(defun read-all()
  (let ((codes nil)
        (titles nil)
        (dirs nil)
        (dir-sizes nil)
        (circles nil))
   (let ((circle-dirs (uiop:subdirectories *root-dir*)))
    (dolist (circle circle-dirs)
      (let ((works (uiop:subdirectories circle)))
        (dolist (work works)
          ; (print (first (last (pathname-directory work))))
          (when (ppcre:scan "^RJ\\d+" (first (last (pathname-directory work))))
            (let* ((work-namestring (first (last (pathname-directory work))))
                   (tmp (ppcre:split " " work-namestring))
                   (voice-files (get-voice-files work))
                   (title (format nil "~{~A~^~}" (rest tmp))))
              (when (equal title "")
                (setf title "unknown"))
              (push title titles)
              (push (first tmp) codes)
              (push work dirs)
              (push (first (last (pathname-directory circle))) circles)
              (push (get-files-size voice-files) dir-sizes)))))))
   (list dir-sizes circles codes titles dirs)))

(defun write-to-csv (out-csv &rest args)
  (with-open-file (f out-csv
                     :direction :output
                     :if-does-not-exist :create
                     :if-exists :supersede)
    (write-line "dir_sizes,circles,codes,titles,dir" f)
    (write-line (apply #'data-to-csv args) f)))


(defun data-to-csv (&rest args)
  (if (member nil args)
      ""
      (concatenate 'string (format nil "~{~A~^,~}~%" (mapcar (lambda (n)
                                                             (format nil "\"~A\"" (first n)))
                                                           args))
                   (apply #'data-to-csv (mapcar #'rest args)))))

(defun write-to-html (out-txt &rest args)
 (with-open-file (f out-txt
                     :direction :output
                     :if-does-not-exist :create
                     :if-exists :supersede)
   (write-sequence (apply #'data-to-html (cons 0 args)) f)))

(defun data-to-html (num &rest args)
  "args is of form dir_sizes,circles,codes,titles,dirs
   and table is of form no., size, circle, code, title"
  (if (member nil args)
      ""
  (concatenate 'string (format nil "<tr>
<td class=\"right\">~A</td>
<td class=\"right\">~A</td>
<td class=\"right\">~A</td>
<td class=\"right\">~A</td>
<td class=\"content\" title=\"Stream with ::play key ~A\"><a href=\"#\" onclick=\"prompt('Paste into discord:','::play key ~A')\">~A</a></td>
</tr>~%"
                               num (caar args) (caadr args) (caaddr args)
                               num num (car (cadddr args)))
               (apply #'data-to-html (cons (1+ num) (mapcar #'rest args))))))

(defun get-voice-files (work-dir)
  (remove-if-not (lambda (file)
                   (let ((allow nil))
                     (dolist (suff *sound-files* allow)
                       (setf allow (or (ppcre:scan (concatenate 'string suff "$") (file-namestring file))
                                       allow)))))
               (uiop:directory-files work-dir)))

(defun get-files-size (file-dirs)
  "in megabytes"
  (/ (reduce #'+ (mapcar (lambda (file-dir)
                           (osicat-posix:stat-size (osicat-posix:stat file-dir)))
                         file-dirs))
     (* 1024.0 1024)))

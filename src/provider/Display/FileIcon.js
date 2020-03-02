import React from 'react';
import PropTypes from 'prop-types';

import fileBack from '../../assets/icon/file-back.png';
import xlsIcon from '../../assets/icon/file-xls.png';
import pptIcon from '../../assets/icon/file-ppt.png';
import docIcon from '../../assets/icon/file-doc.png';
import folderIcon from '../../assets/icon/file-folder.png';
import fileIcon from '../../assets/icon/file-file.png';
import pdfIcon from '../../assets/icon/file-pdf.png';
import jpgIcon from '../../assets/icon/file-jpg.png';
import pngIcon from '../../assets/icon/file-png.png';
import zipIcon from '../../assets/icon/file-zip.png';
import mp3Icon from '../../assets/icon/file-mp3.png';
import aviIcon from '../../assets/icon/file-avi.png';
import mp4Icon from '../../assets/icon/file-mp4.png';

const availablesIcon = [
  { image: xlsIcon, ext: ['xls', 'xlsx'], type: 'excel' },
  { image: pptIcon, ext: ['ppt', 'pptx'], type: 'presentation' },
  { image: docIcon, ext: ['doc', 'docx'], type: 'document' },
  { image: jpgIcon, ext: ['jpg', 'jpeg'], type: 'image' },
  { image: pdfIcon, ext: ['pdf'], type: 'reader' },
  { image: zipIcon, ext: ['tar', 'gz', 'zip'], type: 'compression' },
  { image: pngIcon, ext: ['png'], type: 'image' },
  { image: aviIcon, ext: ['avi'], type: 'video' },
  { image: mp4Icon, ext: ['mp4'], type: 'video' },
  { image: mp3Icon, ext: ['mp3'], type: 'music' }
];

const FileIconType = ({ fileName }) => {
  let icon = folderIcon;
  if (fileName) {
    const splitFilename = fileName.split('.');
    if (splitFilename.length > 1) {
      const extension = splitFilename[splitFilename.length - 1];
      const findIconObj = availablesIcon.find(item => {
        if (item.ext && item.ext.indexOf(extension) > -1) {
          return true;
        }

        return false;
      });

      if (findIconObj) {
        icon = findIconObj.image;
      } else {
        icon = fileIcon;
      }
    } else {
      icon = folderIcon;
    }
  } else {
    icon = fileBack;
  }

  return <img src={icon} className="file-icon-img" alt="file-icon" />;
};

const FileIcon = ({ type, size, children, fileName }) => (
  <span className={`file-icon file-icon-${size}`}>
    {typeof children !== 'undefined' ? children : <FileIconType type={type} fileName={fileName} />}
  </span>
);

FileIcon.propTypes = {
  type: PropTypes.string,
  fileName: PropTypes.string,
  size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl'])
};

FileIcon.defaultProps = {
  type: '',
  size: 'md',
  fileName: ''
};

export default FileIcon;

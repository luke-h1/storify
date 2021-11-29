import React, { useState } from 'react'



const Upload = () => {
  const [files, setFiles] = useState<string[]>([]);
  const {getRootProps, getInputProps, isDragActive} = useDropzone({
    accept: 'image/*',
    onDrop: acceptedFiles => {
      setFiles(acceptedFiles.map(file => Object.assign(file, {
        preview: URL.createObjectURL(file)
      })))
    }
  })
  return (
    <div>
      <div {...getRootProps({className: 'dropzone'})}>
        <input {...getInputProps()} />
        <p>Drag and drop some files here, or click to select files</p>
      </div>
   </div>
  )
export default Upload;

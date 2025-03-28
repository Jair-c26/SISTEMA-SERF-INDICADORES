// src/components/FileUploadForm.jsx

import React from "react"
import { RiDeleteBinLine, RiFileLine } from "@remixicon/react"
import { Divider, TextInput } from "@tremor/react"
import { useDropzone } from "react-dropzone"
import { IconFileZip, IconTrash, IconEye } from "@tabler/icons-react";
// Ajusta la ruta a tu Select
import { Select, SelectItem, SelectTrigger, SelectValue, SelectContent } from "../../../../components/dashboard/Select"

function classNames(...classes) {
  return classes.filter(Boolean).join(" ")
}

export default function FileUploadForm() {
  const [files, setFiles] = React.useState([])
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (acceptedFiles) => setFiles(acceptedFiles),
  })

  const filesList = files.map((file) => (
    <li
      key={file.path}
      className="relative rounded-tremor-default border border-tremor-border bg-tremor-background p-4 shadow-tremor-input dark:border-dark-tremor-border dark:bg-dark-tremor-background dark:shadow-dark-tremor-input"
    >
      <div className="absolute right-4 top-1/2 -translate-y-1/2">
        <button
          type="button"
          className="rounded-tremor-small p-2 text-tremor-content-subtle hover:text-tremor-content dark:text-dark-tremor-content-subtle hover:dark:text-dark-tremor-content"
          aria-label="Remove file"
          onClick={() =>
            setFiles((prev) => prev.filter((f) => f.path !== file.path))
          }
        >
          <IconTrash className="size-5 shrink-0" aria-hidden />
        </button>
      </div>
      <div className="flex items-center space-x-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-tremor-small bg-tremor-background-subtle dark:bg-dark-tremor-background-subtle">
          <IconFileZip
            className="size-5 text-tremor-content-emphasis dark:text-dark-tremor-content-emphasis"
            aria-hidden
          />
        </span>
        <div>
          <p className="text-tremor-label font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong">
            {file.path}
          </p>
          <p className="mt-0.5 text-tremor-label text-tremor-content dark:text-dark-tremor-content">
            {file.size} bytes
          </p>
        </div>
      </div>
    </li>
  ))

  return (
    <div className="space-y-6 relative overflow-visible">
      {/* 1. Campo para subir archivo */}
      <div>
        <label
          htmlFor="file-upload-2"
          className="text-tremor-default font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong"
        >
          File(s) upload
        </label>
        <div
          {...getRootProps()}
          className={classNames(
            isDragActive
              ? "border-tremor-brand bg-tremor-brand-faint dark:border-dark-tremor-brand dark:bg-dark-tremor-brand-faint"
              : "",
            "mt-2 flex justify-center rounded-tremor-default border border-dashed border-gray-300 px-6 py-8 dark:border-dark-tremor-border"
          )}
        >
          <div>
            <IconFileZip
              className="mx-auto h-12 w-12 text-tremor-content-subtle dark:text-dark-tremor-content"
              aria-hidden
            />
            <div className="mt-4 flex text-tremor-default leading-6 text-tremor-content dark:text-dark-tremor-content">
              <p>Drag and drop or</p>
              <label
                htmlFor="file"
                className="relative cursor-pointer rounded-tremor-small pl-1 font-medium text-tremor-brand hover:underline hover:underline-offset-4 dark:text-dark-tremor-brand"
              >
                <span>choose file(s)</span>
                <input
                  {...getInputProps()}
                  id="file-upload-2"
                  name="file-upload-2"
                  type="file"
                  className="sr-only"
                />
              </label>
              <p className="pl-1">to upload</p>
            </div>
          </div>
        </div>
        <p className="mt-2 text-tremor-label leading-5 text-tremor-content dark:text-dark-tremor-content sm:flex sm:items-center sm:justify-between">
          <span>All file types are allowed to upload.</span>
          <span className="pl-1 sm:pl-0">Max. size per file: 50MB</span>
        </p>

        {filesList.length > 0 && (
          <>
            <h4 className="mt-6 text-tremor-default font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong">
              File(s) to upload
            </h4>
            <ul role="list" className="mt-4 space-y-4">
              {filesList}
            </ul>
          </>
        )}
      </div>

      {/* 2. Select e Input (vertical) */}
      <div className="flex flex-col space-y-4">
        <div className="relative">
          <label
            htmlFor="accounting-category"
            className="mb-1 block text-tremor-default font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong"
          >
            Accounting Categorization
          </label>
          {/* Usa tu Select con la estructura Radix */}
          <Select defaultValue="consulting">
            <SelectTrigger id="accounting-category" className="w-full">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent> 
              <SelectItem value="consulting">Consulting Fees</SelectItem>
              <SelectItem value="travel">Travel Expenses</SelectItem>
              <SelectItem value="office">Office Supplies</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label
            htmlFor="memo"
            className="mb-1 block text-tremor-default font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong"
          >
            Memo
          </label>
          <TextInput
            id="memo"
            name="memo"
            placeholder="Describe the business purpose for this expense"
          />
        </div>
      </div>
    </div>
  )
}

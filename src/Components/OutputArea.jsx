import React, { useState, useEffect } from 'react'

const OutputArea = ({content, saveIt, saveButton}) => {

  const [jsonData, setJsonData] = useState(null)

  useEffect(() => {
    if (content && content.type === 'json') {
      setJsonData({ ...content.data })
    } else {
      setJsonData(null)
    }
  }, [content])

  const onSave = () => {
    if (content && content.type === 'json' && jsonData) {
      saveIt('json', jsonData)
    } else if (content) {
      saveIt(content.type, content.data)
    } else {
      alert("No content or type to save")
    }
  }
  
  const handleChange = (key, value) => {
    setJsonData(prevData => ({
      ...prevData,
      [key]: value,
    }))
  }
  const renderPreview = () => {

    if(!content){
      return <p className="text-gray-500 italic">No output to display.Please submit the input</p>
    }

    switch(content.type){
      case 'json':
        if (!jsonData) {
          return <p className="text-gray-500 italic">Loading JSON data for preview...</p>
        }

        return (
          <form className="space-y-4">
            {Object.entries(jsonData).map(([key, value]) => {
              const capsLable = key.charAt(0).toUpperCase() + key.slice(1)
              let inputElement
              if(key === 'gender'){
                // radio btn
                inputElement = (
                  <div className="flex items-center space-x-4">
                    <label className="inline-flex items-center">
                      <input type="radio" className="form-radio" name={key} onChange={() => handleChange(key, 'male')}
                        value="male" checked={value?.toLowerCase() === 'male'}
                      />
                      <span className="ml-2 text-gray-700">Male</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input type="radio" className="form-radio" name={key}  onChange={() => handleChange(key, 'female')}
                        value="female" checked={value?.toLowerCase() === 'female'}
                      />
                      <span className="ml-2 text-gray-700">Female</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input type="radio" className="form-radio" name={key} onChange={() => handleChange(key, 'other')}
                        value="other" checked={value?.toLowerCase() === 'other'}
                      />
                      <span className="ml-2 text-gray-700">Other</span>
                    </label>
                  </div>
                )
              } else if(key === 'dob'){
                inputElement = (
                  <input type="date" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    value={value} onChange={(e) => handleChange(key, e.target.value)}
                  />
                )
              } else {
                inputElement = (
                  <input type="text" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    value={value || ''} onChange={(e) => handleChange(key, e.target.value)}
                  />
                )
              }

              return (
                <div key={key}>
                  <label className="block text-sm font-medium text-gray-700">{capsLable}:</label>
                  {inputElement}
                </div>
              )
            })}
          </form>
        )
      case 'image':
        return (
          <div className="flex justify-center items-center h-full">
            <img src={content.data} alt="Captured" className="max-w-full max-h-96 object-contain rounded-lg shadow-md" />
          </div>
        )
      case 'video':
        return (
          <div className="flex justify-center items-center h-full">
            <video src={content.data} controls className="max-w-full max-h-96 object-contain rounded-lg shadow-md" />
          </div>
        )
      default:
        return <p className="text-gray-500">No Content for preview</p>
    }
  }

  return (
    <div className="flex-grow bg-white border border-gray-200 rounded-lg shadow-sm px-6 py-3 mb-4 overflow-auto">
      <h2 className="text-xl font-semibold text-gray-700 mb-3">Output Preview</h2>
      <div className="min-h-[120px] flex flex-col justify-start items-center border border-dashed border-gray-300 rounded-md p-4">
        {renderPreview()}
      </div>
      {saveButton && content && (
        <div className="flex justify-end mt-4">
          <button
            className="px-4 py-1.5 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2
             focus:ring-indigo-500 focus:ring-opacity-50 transition ease-in-out duration-150"
            onClick={onSave}
          >Save it!
          </button>
        </div>
      )}
    </div>
  )
}

export default OutputArea

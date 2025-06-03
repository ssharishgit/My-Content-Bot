import { useState } from 'react'
import './App.css'
import UserEntry from './Components/UserEntry'
import Latest from './Components/Latest'
import OutputArea from './Components/OutputArea'

function App() {

  const [inputType, setInputType] = useState('json')
  const [output, setOutput] = useState(null)
  const [latestData, setLatestData] = useState(null) 
  const [isSave, setIsSave] = useState(false)

  const handleReset = () => {
    setInputType('json') 
    setOutput(null)
    setLatestData(null)
    setIsSave(false)
  }

  const handleSubmit = (type, data) => {
    setOutput({ type, data })
    setIsSave(true)
  }

  const handleSave = () => {
    if (output) {
      setLatestData(output)
      setInputType('json')
    }
  }

  return (
    <>
      
      <div className="min-h-screen bg-gray-50 px-4 py-1">
        <div className="flex flex-col lg:flex-row gap-4 h-full">

          <div className="flex flex-col flex-grow lg:w-[65%] h-full">
            <OutputArea content ={output} onSave={handleSave} saveButton={isSave} />
            <UserEntry inputType={inputType} setInputType={setInputType} onSubmit={handleSubmit} onReset={handleReset} />
          </div>

          <div className="lg:w-1/4 xl:w-[30%] bg-white border border-gray-200 rounded-lg shadow-md px-3 flex-shrink-0">
            <Latest data={latestData} />
          </div>

        </div>
      </div>
    </>
  )
}

export default App

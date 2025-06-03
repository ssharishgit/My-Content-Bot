import React, { useState, useRef, useEffect, useCallback } from 'react'

const JSON_PLACEHOLDER = `{"name": "ram", "gender": "male","dob":"2000-10-25"}`

function UserEntry({ inputType, setInputType, onSubmit, onReset }) {
  const [jsonString, setJsonString] = useState(JSON_PLACEHOLDER)
  const videoRef = useRef(null)
  const mediaRecorderRef = useRef(null)
  const [stream, setStream] = useState(null)
  const [isRecording, setIsRecording] = useState(false)
  const [recordedChunks, setRecordedChunks] = useState([])
  const [mediaBlobUrl, setMediaBlobUrl] = useState(null)

  const stopStream = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop())
      setStream(null)
      if (videoRef.current) {
        videoRef.current.srcObject = null
      }
    }
  }, [stream])

  useEffect(() => {
    return () => {
      stopStream()
      if (mediaBlobUrl) {
        URL.revokeObjectURL(mediaBlobUrl) 
      }
    }
  }, [stopStream, mediaBlobUrl])

  // Handles changing the input type (JSON, Image, Video)
  const handleInputChange = (type) => {
    setInputType(type)
    stopStream()
    setRecordedChunks([])
    if (mediaBlobUrl) {
      URL.revokeObjectURL(mediaBlobUrl)
    }
    setMediaBlobUrl(null)
    setIsRecording(false)
  }

  const startCamera = async (audio = false) => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true, audio })
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream
      }
      setStream(mediaStream)
      if (mediaBlobUrl) {
        URL.revokeObjectURL(mediaBlobUrl) 
      }
      setMediaBlobUrl(null)
      return mediaStream
    } catch (err) {
      console.error("Error accessing camera: ", err)
      alert("Error accessing camera. Please check permissions and ensure no other application is using the camera.")
      return null
    }
  }

  const capturePhoto = () => {
    if (videoRef.current && stream) {
      const canvas = document.createElement('canvas')
      canvas.width = videoRef.current.videoWidth
      canvas.height = videoRef.current.videoHeight
      const context = canvas.getContext('2d')
      context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height)
      const imageUrl = canvas.toDataURL('image/png')
      if (mediaBlobUrl) {
        URL.revokeObjectURL(mediaBlobUrl) 
      }
      setMediaBlobUrl(imageUrl)
      stopStream()
    }
  }

  const startRecording = async () => {
    const mediaStream = await startCamera(true) 
    if (!mediaStream) return

    try {
      const mediaRecorder = new MediaRecorder(mediaStream)
      mediaRecorderRef.current = mediaRecorder
      setIsRecording(true)
      setRecordedChunks([])
      if (mediaBlobUrl) {
        URL.revokeObjectURL(mediaBlobUrl) 
      }
      setMediaBlobUrl(null) 

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          setRecordedChunks((prev) => [...prev, event.data])
        }
      }

      mediaRecorder.onstop = () => {
        const blob = new Blob(recordedChunks, { type: 'video/webm' })
        const videoUrl = URL.createObjectURL(blob)
        setMediaBlobUrl(videoUrl)
        setIsRecording(false)
        stopStream() 
      }

      mediaRecorder.start()

      // Stop recording after 10 seconds
      setTimeout(() => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
          mediaRecorderRef.current.stop()
        }
      }, 10000)
    } catch (err) {
      console.error("Error setting up MediaRecorder: ", err)
      alert("Error setting up video recording. Ensure your browser supports MediaRecorder API.")
      stopStream()
    }
  }

  const handleSubmit = () => {
    if (inputType === 'json') {
      try {
        const parsedJson = JSON.parse(jsonString)
        onSubmit('json', parsedJson)
      } catch (e) {
        alert("Invalid JSON string: " + e.message)
        console.error("JSON parse error:", e)
      }
    } else if (inputType === 'image' && mediaBlobUrl) {
      onSubmit('image', mediaBlobUrl)
    } else if (inputType === 'video' && mediaBlobUrl) {
      onSubmit('video', mediaBlobUrl)
    } else {
      alert("Please provide input (e.g., capture image/video or enter JSON) before submitting.")
    }
  }

  const handleGlobalReset = () => {
    setJsonString(JSON_PLACEHOLDER)
    stopStream()
    if (mediaBlobUrl) {
      URL.revokeObjectURL(mediaBlobUrl) 
    }
    setRecordedChunks([])
    setMediaBlobUrl(null)
    setIsRecording(false)
    onReset() // global reset call
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-md p-4 mt-2">
      <h2 className="text-xl font-semibold text-gray-700 mb-3">Input Options</h2>
      <div className="flex space-x-4 mb-3">
        <button
          onClick={() => handleInputChange('json')}
          className={`px-4 py-1.5 rounded-md transition ease-in-out duration-150 ${
            inputType === 'json' ? ' font-medium bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >JSON
        </button>
        <button
          onClick={() => handleInputChange('image')}
          className={`px-4 py-1.5 rounded-md transition ease-in-out duration-150 ${
            inputType === 'image' ? ' font-medium bg-green-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >Image
        </button>
        <button
          onClick={() => handleInputChange('video')}
          className={`px-4 py-1.5 rounded-md transition ease-in-out duration-150 ${
            inputType === 'video' ? ' font-medium bg-orange-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >Video
        </button>
      </div>

      <div className="border border-dashed border-gray-300 rounded-md p-4 min-h-[150px] flex flex-col justify-center items-center">
        {inputType === 'json' && (
          <textarea
            className="w-full h-full min-h-[120px] p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter JSON string here.." onChange={(e) => setJsonString(e.target.value)} value={jsonString}
          />
        )}

        {inputType === 'image' && (
          <div className="flex flex-col items-center justify-center w-full">
            <video ref={videoRef} className="w-3/5 max-h-[12.5rem] bg-gray-700 rounded-md" autoPlay playsInline muted></video>
            {!stream && !mediaBlobUrl && (
              <button
                onClick={() => startCamera()}
                className="mt-4 px-4 py-1.5 bg-green-500 text-white font-medium rounded-md hover:bg-green-600"
              >Enable Camera & Preview
              </button>
            )}
            {stream && (
              <button
                onClick={capturePhoto}
                className="mt-4 px-4 py-1.5 bg-green-500 text-white font-medium rounded-md hover:bg-green-600"
              >Capture Photo
              </button>
            )}
            {mediaBlobUrl && (
              <p className="mt-2 text-sm text-gray-600">Image captured. Click Submit to preview.</p>
            )}
          </div>
        )}

        {inputType === 'video' && (
          <div className="flex flex-col items-center justify-center w-full">
            {mediaBlobUrl ? (
              <video
                src={mediaBlobUrl}
                controls
                className="w-3/4 max-h-[12.5rem] bg-gray-700 rounded-md"
                autoPlay 
                loop 
              ></video>
            ) : (
              <video
                ref={videoRef}
                className="w-3/4 max-h-[12.5rem] bg-gray-700 rounded-md"
                autoPlay
                playsInline
                muted={!isRecording} 
              ></video>
            )}

            {!stream && !isRecording && !mediaBlobUrl && (
              <button onClick={startRecording} className="mt-4 px-4 py-1.5 bg-orange-500 text-white font-medium rounded-md hover:bg-orange-600">
                Start Recording (10s)
              </button>
            )}
            {isRecording && (
              <p className="mt-4 text-lg font-semibold text-red-500">Recording... (10s)</p>
            )}
            {mediaBlobUrl && (
              <p className="mt-2 text-sm text-gray-600">Video recorded. Play above or click Submit.</p>
            )}
          </div>
        )}
      </div>

      <div className="flex justify-between mt-4">
        <button
          onClick={handleSubmit}
          className="px-4 py-1.5 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2
            focus:ring-indigo-500 focus:ring-opacity-50 transition ease-in-out duration-150"
        >Submit
        </button>
        <button
          onClick={handleGlobalReset}
          className="px-4 py-1.5 bg-gray-300 text-white font-medium rounded-md hover:bg-gray-500 focus:outline-none focus:ring-2
            focus:ring-gray-300 focus:ring-opacity-50 transition ease-in-out duration-150"
        >Reset
        </button>
      </div>
    </div>
  )
}

export default UserEntry
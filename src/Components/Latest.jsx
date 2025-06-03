import React from 'react';

function Latest({ data }) {
  if (!data) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg shadow-md p-6 mt-4 min-h-[100px] flex justify-center items-center text-gray-500">
        <p>No data saved yet.</p>
      </div>
    );
  }

  const renderContent = () => {
    switch (data.type) {
      case 'json':
        return (
          <div className="p-3">
            <h3 className="font-medium mb-2">Latest JSON Entry:</h3>
            <table className="min-w-full bg-white border border-gray-300 rounded-md">
              <thead>
                <tr>
                  <th className="py-2 px-4 border-b border-gray-300 bg-gray-50  text-xs font-semibold text-gray-600 uppercase tracking-wider">Key</th>
                  <th className="py-2 px-4 border-b border-gray-300 bg-gray-50  text-xs font-semibold text-gray-600 uppercase tracking-wider">Value</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(data.data).map(([key, value]) => {
                  let displayValue = value;
                  if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
                    const [year, month, day] = value.split('-');
                    displayValue = `${day}/${month}/${year}`;
                  } else if (typeof value === 'object') {
                    displayValue = JSON.stringify(value);
                  } else {
                    displayValue = String(value);
                  }

                  return (
                    <tr key={key} className="hover:bg-gray-50">
                      <td className="py-2 px-4 border-b border-gray-200 text-sm text-gray-700 capitalize">{key}</td>
                      <td className="py-2 px-4 border-b border-gray-200 text-sm text-gray-700">{displayValue}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        );
      case 'image':
        return (
          <div className="p-4 flex flex-col items-center">
            <h3 className="font-medium mb-2">Latest Image:</h3>
            <img src={data.data} alt="Latest Captured" className="max-w-full h-auto rounded-md border border-gray-300" />
          </div>
        );
      case 'video':
        return (
          <div className="p-4 flex flex-col items-center">
            <h3 className="font-medium mb-2">Latest Video:</h3>
            <video src={data.data} controls className="max-w-full h-auto rounded-md border border-gray-300"></video>
          </div>
        );
      default:
        return <p>No latest data to display.</p>;
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-md px-2 py-4 mt-4">
      <h2 className="text-2xl font-semibold text-gray-700 mb-4">Latest Data</h2>
      <div className="border border-dashed border-gray-300 rounded-md p-4 min-h-[150px] flex flex-col justify-center items-center">
        {renderContent()}
      </div>
    </div>
  );
}

export default Latest;
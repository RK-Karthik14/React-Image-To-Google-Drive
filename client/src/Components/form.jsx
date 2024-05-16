import React, { useState} from 'react'
import axios from 'axios'

export default function Form() {

  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [file, setFile] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append('name', name);
    formData.append('age', age);
    formData.append('file', file); // Append file to form data

    try {
      const response = await axios.post('http://localhost:3000/register', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('User registered:', response.data);
      alert('User registered successfully!');
    } catch (error) {
      console.error('Error registering user:', error);
      alert('Failed to register user.');
    }
  };

  return (
    <div className='flex justify-center items-center h-screen bg-black'>
      <div className="w-96 p-6 shadow-lg bg-white rounded-md">
        <h1 className="text-lg font-bold mb-4">Registration Form</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
            <input type="text" id="name" name="name" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" onChange={(e) => setName(e.target.value)}/>
          </div>
          <div className="mb-4">
            <label htmlFor="age" className="block text-sm font-medium text-gray-700">Age</label>
            <input type="number" id="age" name="age" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" onChange={(e) => setAge(e.target.value)}/>
          </div>
          <div className="mb-4">
            <label htmlFor="image" className="block text-sm font-medium text-gray-700">Profile Image</label>
            <input type="file" id="image" name="image" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" onChange={(e) => setFile(e.target.files[0])}/>
          </div>
          <button type="submit" className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
            Register
          </button>
        </form>
      </div>
    </div>
  )
}
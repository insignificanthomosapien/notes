import React, { useState, useEffect } from 'react'
import noteService from './services/notes'
import Note from './components/Note'

const App = () => {
    const [notes, setNotes] = useState([])
    const [newNote, setNewNote] = useState('')
    const [showAll, setShowAll] = useState(true)

    //Loads JSON data into notes
    useEffect(() => {
      noteService
        .getAll()
        .then(response => response.data)
        .then(initialNotes => setNotes(initialNotes))
        }
      ,[])
      
    

    const addNote = (event) => {
      event.preventDefault()
      const noteObject = {
        content: newNote,
        date: new Date().toISOString(),
        important: Math.random() < 0.5,
        //Its better to let the server generate ids
      }
      
      noteService
        .create(noteObject)
        .then(response => {
          setNotes(notes.concat(response.data))
          setNewNote('')
        })
    }

    const handleNoteChange = (event) => {
      console.log(event.target.value)
      setNewNote(event.target.value)
      
    }

    const toggleImportanceOf = (id) => {
      const note = notes.find(n => n.id === id)
      const changedNote = {...note, important: !note.important}

      noteService
        .update(id, changedNote)
        .then(response => {
          setNotes(notes.map(note => note.id !== id ? note : response.data))
        })
        .catch(error => console.log('fail'))
      }

    //Determines whether all notes are shown or only the important ones
    const notesToShow = showAll ? notes : notes.filter(note => note.important)

    return (
      <div>
        <h1>Notes</h1>
        <div>
          <button onClick = {() => setShowAll(!showAll)}>
            show {showAll ? 'important': 'all'}
          </button>
        </div>
        <ul>
          {notesToShow.map(note => 
          <Note key = {note.id} note = {note} toggleImportant = {() => toggleImportanceOf(note.id)}/>
        )}
        </ul>
        <form onSubmit = {addNote}>
          <input 
              value = {newNote}
              onChange = {handleNoteChange}/>
          <button type = "submit">save</button>
        </form>
      </div>
    )
  }

  export default App
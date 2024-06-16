import React, { useState, useEffect } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // Import Quill styles
import './notes.css';
import { supabase } from '../../Services/supabase';
import { useAuth } from '../../hooks/userAuth';

const Notes = () => {
    const [currentTitle, setCurrentTitle] = useState('');
    const [currentNote, setCurrentNote] = useState('');
    const [currentNoteId, setCurrentNoteId] = useState(null);
    const [notes, setNotes] = useState([]);
    const { user } = useAuth();

    useEffect(() => {
        const loadNotes = async () => {
            if (!user) {
                return;
            }

            console.log(user);

            const { data, error } = await supabase.from('Notes').select('*').eq('User_id', user.id);
            if (error) {
                console.error('Error fetching notes:', error);
            } else {
                console.log('Fetched notes:', data);
                setNotes(data);
            }
        };

        loadNotes();
    }, [user]);

    const addNote = async () => {
        if (currentTitle.trim() !== '' && currentNote.trim() !== '') {
            if (currentNoteId) {
                // Update the existing note
                const { error } = await supabase
                    .from('Notes')
                    .update({ Title: currentTitle, Note: currentNote })
                    .eq('id', currentNoteId)
                    .eq('User_id', user.id);

                if (error) {
                    console.error('Error updating note:', error);
                } else {
                    setNotes(notes.map(note => note.id === currentNoteId ? { ...note, Title: currentTitle, Note: currentNote } : note));
                }
            } else {
                // Insert a new note
                const { data, error } = await supabase
                    .from('Notes')
                    .insert([{ Title: currentTitle, Note: currentNote, User_id: user.id }]);

                if (error) {
                    console.error('Error adding note:', error);
                } else {
                    setNotes([...notes, data]);
                }
            }
            setCurrentTitle('');
            setCurrentNote('');
            setCurrentNoteId(null);
        }
    };

    const editNote = (note) => {
        setCurrentTitle(note.Title);
        setCurrentNote(note.Note);
        setCurrentNoteId(note.id);
    };

    return (
        <div className="container">
            <div className="editor-section">
                <input
                    type="text"
                    value={currentTitle}
                    onChange={(e) => setCurrentTitle(e.target.value)}
                    placeholder="Note Title"
                    className="title-input"
                />
                <ReactQuill
                    value={currentNote}
                    onChange={setCurrentNote}
                    placeholder="Write your note here..."
                    className="quill-editor"
                />
                <button onClick={addNote} className="add-note-button">
                    {currentNoteId ? 'Save Note' : 'Add Note'}
                </button>
            </div>
            <div className="notes-section">
                <h2>Notes</h2>
                <div className="notes-list">
                    {notes.length > 0 ? (
                        notes.map((note, index) => (
                            <div key={index} className="note-item" onClick={() => editNote(note)}>
                                <h1>{note.Title}</h1>
                                <p dangerouslySetInnerHTML={{ __html: note.Note }}></p>
                            </div>
                        ))
                    ) : (
                        <p>No notes available</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Notes;

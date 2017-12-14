var Note = React.createClass({
    render: function () {
        var style = {backgroundColor: this.props.color};
        return (
            <div className="note" style={style}>
                <span className="delete-note" onClick={this.props.onDelete}> x </span>
                {this.props.children}
            </div>
        );
    }
});

var Palette = React.createClass({
    chooseBackgroundNote: function (id) {
        this.props.onSetColor(id);
    },

    render: function () {
        var self = this;
        return (
            <div className="note-palette">
                {
                    this.props.colors.map(function (color, index) {
                        var style = {backgroundColor: color.color};
                        return (
                            <span
                                className={index === self.props.activeColor ? 'note-color active' : 'note-color'}
                                key={color.id}
                                style={style}
                                onClick={self.chooseBackgroundNote.bind(self, index)}>
                            </span>
                        );
                    })
                }
            </div>
        );
    }
});

var NoteEditor = React.createClass({
    getInitialState: function () {
        return {
            text: '',
            activeColorId: 0,
            colors: [
                {
                    id: 1,
                    color: '#FFDAB9',
                },
                {
                    id: 2,
                    color: '#B0E0E6',
                },
                {
                    id: 3,
                    color: '#98FB98',
                },
                {
                    id: 4,
                    color: '#F08080',
                },
                {
                    id: 5,
                    color: '#FFC0CB',
                },
                {
                    id: 6,
                    color: '#E6E6FA',
                },
                {
                    id: 7,
                    color: '#FAF0E6',
                }
            ],
        };
    },

    handleTextChange: function (event) {
        this.setState({text: event.target.value});
    },

    handleNoteAdd: function () {
        var newNote = {
            text: this.state.text,
            color: this.state.colors[this.state.activeColorId].color,
            id: Date.now()
        };

        this.props.onNoteAdd(newNote);
        this.setState({text: ''});
    },

    handleColorChange: function (color) {
        this.setState({activeColorId: color});
    },

    render: function () {
        return (
            <div className="note-editor">
                <textarea
                    className="textarea"
                    placeholder="Enter your note here..."
                    rows={5}
                    value={this.state.text}
                    onChange={this.handleTextChange}/>
                <Palette activeColor={this.state.activeColorId} colors={this.state.colors} onSetColor={this.handleColorChange}/>
                <button className="add-button" onClick={this.handleNoteAdd}>Add</button>
            </div>
        );
    },
});

var NotesGrid = React.createClass({
    componentDidMount: function () {
        var grid = this.refs.grid;
        this.msnry = new Masonry(grid, {
            itemSelector: '.note',
            columnWidth: 200,
            gutter: 10,
            isFitWidth: true
        });
    },

    componentDidUpdate: function (prevProps) {
        if (this.props.notes.length !== prevProps.notes.length) {
            this.msnry.reloadItems();
            this.msnry.layout();
        }
    },

    render: function () {
        var onNoteDelete = this.props.onNoteDelete;
        return (
            <div className="notes-grid" ref="grid">
                {
                    this.props.notes.map(function (note) {
                        return (
                            <Note
                                key={note.id}
                                onDelete={onNoteDelete.bind(null, note)}
                                color={note.color}>
                                {note.text} </Note>
                        );
                    })
                }
            </div>
        );
    }
});

var NotesApp = React.createClass({
    getInitialState: function () {
        return {
            notes: [],
            colorActive: null,
        }
    },

    componentDidMount: function () {
        var localNotes = JSON.parse(localStorage.getItem('notes'));
        if (localNotes) {
            this.setState({
                notes: localNotes
            })
        }
    },

    componentDidUpdate: function () {
        this._updateLocalStorage();
    },

    handleNoteDelete: function (note) {
        var noteId = note.id;
        var newNotes = this.state.notes.filter(function (note) {
            return note.id !== noteId;
        });
        this.setState({notes: newNotes});
    },

    handleNoteAdd: function (newNote) {
        var newNotes = this.state.notes.slice();
        newNotes.unshift(newNote);
        this.setState({notes: newNotes});
    },

    render: function () {
        return (
            <div className="notes-app">
                <h2 className="app-header">NotesApp</h2>
                <NoteEditor onNoteAdd={this.handleNoteAdd} activeColor={this.state.colorActive} set/>
                <NotesGrid notes={this.state.notes} onNoteDelete={this.handleNoteDelete}
                           activeColor={this.state.colorActive}/>
            </div>
        );
    },

    _updateLocalStorage: function () {
        var notes = JSON.stringify(this.state.notes);
        localStorage.setItem('notes', notes);
    }
});

ReactDOM.render(
    <NotesApp />,
    document.getElementById('mount-point')
);
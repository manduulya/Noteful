import React, { Component } from "react";
import NotefulForm from "../NotefulForm/NotefulForm";
import ApiContext from "../ApiContext";
import config from "../config";
import ErrorBox from "../ErrorBox/ErrorBox";
import PropTypes from "prop-types";
import "./AddNote.css";

export default class AddNote extends Component {
  constructor(props) {
    super(props);
    this.state = {
      noteName: "",
      contName: "",
      folder_id: "",
    };
    this.handleChange = this.handleChange.bind();
  }

  // static contextType = ApiContext;
  // state = {
  //   noteName: "",
  //   contName: "",
  //   folder_id: "",
  // };
  // static defaultProps = {
  //   history: {
  //     push: () => {},
  //   },
  // };
  static contextType = ApiContext;

  state = {
    error: null,
  };

  validate(note) {
    if (note.name.length === 0) {
      return "Please enter note name";
    } else if (note.content.length === 0) {
      return "Please enter a content";
    }
    return null;
  }

  handleChange = (e) => {
    this.setState({
      [e.target.getAttribute("name")]: e.target.value,
    });
  };

  handleSubmit = (e) => {
    e.preventDefault();
    console.log({
      name: this.state.noteName,
      content: this.state.noteContent,
      folder_id: this.state.folder_id,
      modified: new Date(),
    });
    // const newNote = {
    //   name: e.target["noteName"].value.trim(),
    //   content: e.target["noteContent"].value.trim(),
    //   folderId: e.target["folder_id"].value.trim(),
    //   modified: new Date(),
    // };
    // let validationError = this.validate(newNote);
    // if (validationError) {
    //   this.setState({ error: validationError });
    //   return;
    // }
    fetch(`${config.API_ENDPOINT}/api/notes`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        note_name: this.state.noteName,
        content: this.state.noteContent,
        folder_id: this.state.folder_id,
        modified: new Date(),
      }),
    })
      .then((res) => {
        if (!res.ok) return res.json().then((e) => Promise.reject(e));
        return res.json();
      })
      .then((note) => {
        this.context.addNote(note);
        this.props.history.push(`/notes/${note.note.id}`);
      })
      .catch((error) => {
        this.setState({ error: error.message });
      });
  };

  render() {
    const { folders = [] } = this.context;
    return (
      <section className="AddNote">
        <h2>Create a note</h2>
        {this.state.error && <ErrorBox message={this.state.error} />}
        <NotefulForm onSubmit={this.handleSubmit}>
          <div className="field">
            <label htmlFor="note-name-input">Name</label>
            <input
              type="text"
              id="note-name-input"
              name="noteName"
              onChange={this.handleChange}
              value={this.state.noteName}
            />
          </div>
          <div className="field">
            <label htmlFor="note-content-input">Content</label>
            <textarea
              id="note-content-input"
              name="noteContent"
              onChange={this.handleChange}
              value={this.state.noteContent}
            />
          </div>
          <div className="field">
            <label htmlFor="note-folder-select">Folder</label>
            <select
              id="note-folder-select"
              name="folder_id"
              required
              onChange={this.handleChange}
              value={this.state.folder_id.toString()}
            >
              <option value={""}>...</option>
              {folders.map((folder) => (
                <option key={folder.id} value={folder.id}>
                  {folder.name}
                </option>
              ))}
            </select>
          </div>
          <div className="buttons">
            <button type="submit">Add note</button>
          </div>
        </NotefulForm>
      </section>
    );
  }
}

AddNote.propTypes = {
  name: PropTypes.string,
};

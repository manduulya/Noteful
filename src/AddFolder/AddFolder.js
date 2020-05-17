import React, { Component } from "react";
import NotefulForm from "../NotefulForm/NotefulForm";
import ApiContext from "../ApiContext";
import config from "../config";
import ErrorBox from "../ErrorBox/ErrorBox";
import "./AddFolder.css";
import PropTypes from "prop-types";

export default class AddFolder extends Component {
  constructor(props) {
    super(props);
    this.state = {
      folderName: "",
    };
  }
  // static defaultProps = {
  //   history: {
  //     push: () => {},
  //   },
  // };
  static contextType = ApiContext;

  state = {
    error: null,
  };

  validate(folder) {
    if (folder.name.length < 3)
      return "Folder name has to have at least 3 characters";
    return null;
  }

  handleChange = (e) => {
    this.setState({
      [e.target.getAttribute("name")]: e.target.value,
    });
  };

  handleSubmit = (e) => {
    e.preventDefault();
    console.log(this.folderName);
    const folder = {
      name: e.target["folderName"].value.trim(),
    };
    let validationError = this.validate(folder);
    if (validationError) {
      this.setState({ error: validationError });
      return;
    }
    fetch(`${config.API_ENDPOINT}/api/folders`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({ folder_name: this.state.folderName }),
    })
      .then((res) => {
        if (!res.ok) return res.json().then((e) => Promise.reject(e));
        return res.json();
      })
      .then((folder) => {
        this.context.addFolder(folder);
        this.props.history.push(`/folder/${folder.id}`);
      })
      .catch((error) => {
        this.setState({ error: error.message });
      });
  };

  render() {
    return (
      <section className="AddFolder">
        <h2>Create a folder</h2>
        {this.state.error && <ErrorBox message={this.state.error} />}
        <NotefulForm onSubmit={this.handleSubmit}>
          <div className="field">
            <label htmlFor="folder-name-input">Name</label>
            <input
              type="text"
              id="folder-name-input"
              name="folderName"
              onChange={this.handleChange}
              value={this.state.folderName}
            />
          </div>
          <div className="buttons">
            <button type="submit">Add folder</button>
          </div>
        </NotefulForm>
      </section>
    );
  }
}

AddFolder.propTypes = {
  value: PropTypes.string,
};

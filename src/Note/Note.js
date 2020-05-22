import React from "react";
import { Link } from "react-router-dom";
import { parseISO } from "date-fns";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ApiContext from "../ApiContext";
import config from "../config";
import ErrorBox from "../ErrorBox/ErrorBox";
import "./Note.css";

export default class Note extends React.Component {
  state = {
    error: null,
  };

  static defaultProps = {
    onDeleteNote: () => {},
  };
  static contextType = ApiContext;

  handleClickDelete = (e) => {
    e.preventDefault();
    const noteId = this.props.id;

    fetch(`${config.API_ENDPOINT}/api/notes/${noteId}`, {
      method: "DELETE",
      headers: {
        "content-type": "application/json",
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Internal Server error");
        return Promise.resolve(true);
      })
      .then(() => {
        this.context.deleteNote(noteId);
        // allow parent to perform extra behaviour
        this.props.onDeleteNote();
      })
      .catch((error) => {
        this.setState({ error: error.message });
      });
  };

  render() {
    const { name, id, modified } = this.props;
    return (
      <div className="Note">
        {this.state.error && <ErrorBox message={this.state.error} />}
        <h2 className="Note__title">
          <Link to={{ pathname: `/note/${id}` }}>{name}</Link>
        </h2>
        <button
          className="Note__delete"
          type="button"
          onClick={this.handleClickDelete}
        >
          <FontAwesomeIcon icon="trash-alt" /> remove
        </button>
        <div className="Note__dates">
          <div className="Note__dates-modified">
            Modified{" "}
            <span className="Date">
              {parseISO(modified, "Do MMM YYYY").toString()}
            </span>
          </div>
        </div>
      </div>
    );
  }
}

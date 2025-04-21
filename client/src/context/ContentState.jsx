import { useState } from "react";
import ContentContext from "./ContentContext";
import { getData, postData } from "../services/HttpService"
import * as GlobalUrls from "../GlobalURL"

const ContentState = (props) => {

  //----- Add NOtE() using Post Httpservice ---------------------------------
  const addNote = async (Data) => {
    try {
      const json = await postData(
        `${GlobalUrls.ADDNOTE_URL}`,
        Data
      );
      if (json.success === true) {
        setNotes(Notes.concat(json));
      }
      return json;
    } catch (error) {
      console.log("Do not add Note due to some error", error);
    }
  };

  const getNote = async (URL) => {
    try {
      const json = await getData(
        URL || `${GlobalUrls.GETNOTE_URL}`,
      );
      if (json.success === true) {
        setNotes(json.data);
      }
      return json;
    } catch (error) {
      console.log("Do not fetch Note due to some error", error);
    }
  };

  // eslint-disable-next-line
  const [Notes, setNotes] = useState([]);
  return (
    <ContentContext.Provider
      value={{ Notes, addNote, getNote}}>
      {props.children}
    </ContentContext.Provider>
  );
};

export default ContentState;

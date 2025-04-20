import { useState } from "react";
import ContentContext from "./ContentContext";
import {  postData } from "../services/HttpService"
import * as GlobalUrls from "../GlobalURL"

const ContentState = (props) => {

//----- Add NOtE() using Post Httpservice ---------------------------------
  const addNote = async (Data) => {
    try {
      const json = await postData(
        `${GlobalUrls.ADDNOTE_URL}`,
        Data
      );
      // setNotes(Notes.concat(json));
      return json;
    }catch (error) {
      console.log("Do not add Note due to some error",error);
    }
    };
    
    const [Notes, setNotes] = useState([]);
    return (
        <ContentContext.Provider
            value={{ Notes, addNote }} >
            {props.children}
        </ContentContext.Provider>
    );
};

export default ContentState;

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
        setNotes(Notes.concat(json.data));
      }
      return json;
    } catch (error) {
      console.log("Do not add Note due to some error", error);
    }
  };


  //----- Add PYQ() using Post Httpservice ---------------------------------
  const addPYQ = async (Data) => {
    try {
      const json = await postData(
        `${GlobalUrls.ADDPYQ_URL}`,
        Data
      );
      if (json.success === true) {
        setPYQ(PYQ.concat(json.data));
      }
      return json;
    } catch (error) {
      console.log("Do not add Note due to some error", error);
    }
  };



  //---------------- GET Note() using Get Httpservice ----------------------- 
  const getNote = async (URL) => {
    try {
      const json = await getData(
        URL || `${GlobalUrls.GETNOTE_URL}`,
      );
      if(json.success === true) {
        setNotes(json.data);
        if(json.myNotes){
          setMyNotes(json.myNotes);
          // console.log("Mynotes---------",json.myNotes);
        }
        if(json.allNotes){
          setAllNotes(json.allNotes);
          // console.log("Mynotes---------",json.allNotes);
        }
      }
      return json;
    } catch (error) {
      console.log("Do not fetch Note due to some error", error);
    }
  };

  // eslint-disable-next-line
  const [Notes, setNotes] = useState([]);
  const [PYQ, setPYQ] = useState([]);

  const [MyNotes, setMyNotes] = useState([]);
  const [AllNotes, setAllNotes] = useState([]);
  return (
    <ContentContext.Provider
      value={{ Notes, MyNotes, AllNotes, PYQ, addNote, getNote, addPYQ}}>
      {props.children}
    </ContentContext.Provider>
  );
};

export default ContentState;

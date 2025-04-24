import { useState } from "react";
import ContentContext from "./ContentContext";
import { getData, postData } from "../services/HttpService"
import * as GlobalUrls from "../GlobalURL"

const ContentState = (props) => {

  //--Add NOtE() using Post Httpservice
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

  //--Add PYQ() using Post Httpservice 
  const addPYQ = async (Data) => {
    try {
      const json = await postData(
        `${GlobalUrls.ADDPYQ_URL}`,
        Data
      );
      if (json.success === true) {
        setPYQ(PYQS.concat(json.data));
      }
      return json;
    } catch (error) {
      console.log("Do not add PYQ due to some error", error);
    }
  };

  //---Add VIDEO() using Post Httpservice 
  const addVideo = async (Data) => {
    try {
      const json = await postData(
        `${GlobalUrls.ADDVIDEO_URL}`,
        Data
      );
      if (json.success === true) {
        setVideo(Video.concat(json.data));
      }
      return json;
    } catch (error) {
      console.log("Do not add Video due to some error", error);
    }
  };

  //---GET Note() using Get Httpservice 
  const getNote = async (URL) => {
    try {
      const json = await getData(
        URL || `${GlobalUrls.GETNOTE_URL}`,
      );
      if (json.success === true) {
        setNotes(json.data);
        if (json.myNotes) {
          setMyNotes(json.myNotes);
        }
        if (json.allNotes) {
          setAllNotes(json.allNotes);
        }
      }
      return json;
    } catch (error) {
      console.log("Do not fetch Note due to some error", error);
    }
  };

  //--GET PYQ() using Get Httpservice 
  const getPYQ = async (URL) => {
    try {
      const json = await getData(
        URL || `${GlobalUrls.GETPYQ_URL}`,
      );
      if (json.success === true) {
        setPYQ(json.data);
        if (json.myPYQ) {
          setMyPYQ(json.myPYQ);
        }
        if (json.allPYQ) {
          setAllPYQ(json.allPYQ);
        }
      }
      return json;
    } catch (error) {
      console.log("Do not fetch PYQ due to some error", error);
    }
  };

  //---GET VIDEO() using Get Httpservice  
  const getVideo = async (URL) => {
    try {
      const json = await getData(
        URL || `${GlobalUrls.GETVideo_URL}`,
      );
      if (json.success === true) {
        setVideo(json.data);
        if (json.myVideo) {
          setMyVideo(json.myVideo);
        }
        if (json.allVideo) {
          setAllVideo(json.allVideo);
        }
      }
      return json;
    } catch (error) {
      console.log("Do not fetch PYQ due to some error", error);
    }
  };

  //---GET LATEST() using Get Httpservice  
  const getLatestUpload = async (URL) => {
    try {
      const json = await getData(
        URL || `${GlobalUrls.GETLATESTDATA_URL}`,
      );
      if (json.success === true) {
        setLatestData(json.data);
        console.log("datacone", json.data)
      }
      return json;
    } catch (error) {
      console.log("Do not fetch setLatest Data due to some error", error);
    }
  };


//========================================[ MY Learning ]=================================================
  //--- Add INMYLEARNING() using Post Httpservice 
  const addInMylearning = async (Data) => {
    try {
      const json = await postData(
        `${GlobalUrls.ADDINMYLEARNING_URL}`,
        Data
      );
      if (json.success === true) {
        setMyLearningData(MyLearningData.concat(json.data));
      }
      return json;
    } catch (error) {
      console.log("Do not add in mylearning due to some error", error);
    }
  };

  //---Remove From MYLEARNING() using Post Httpservice 
  const removeFromMylearning = async (Data) => {
    try {
      const json = await postData(
        `${GlobalUrls.REMOVEFROMMYLEARNING_URL}`,
        Data
      );
      if (json.success === true) {
        setMyLearningNotes(json.notesData);
        setMyLearningVideo(json.videoData)
        setMyLearningPYQ(json.pyqData)
      }
      return json;
    } catch (error) {
      console.log("Do not remove mylearning data due to some error", error);
    }
  };

  //---GETDATA FROM MY LEARNING() using Get Httpservice  
  const getDataFromMyLearning = async (URL) => {
    try {
      const json = await getData(
        URL || `${GlobalUrls.GETDATAFROMMYLEARNING_URL}`,
      );
      if (json.success === true) {
        setMyLearningNotes(json.notesData);
        setMyLearningVideo(json.videoData)
        setMyLearningPYQ(json.pyqData)
      }
      return json;
    } catch (error) {
      console.log("Do not fetch setLatest Data due to some error", error); 
    }
  };



  //=====================================[ Search Content ]=========================================
   //---SEARCH FROM CONTENT () using Get Httpservice  
   const searchContent = async (URL) => {
    try {
      const json = await getData(
        URL || `${GlobalUrls.SEARCHCONTENT_URL}`,
      );
      if (json.success === true) {
        setMyLearningNotes(json.notesData);
        setMyLearningVideo(json.videoData)
        setMyLearningPYQ(json.pyqData)
      }
      return json;
    } catch (error) {
      console.log("Do not fetch setLatest Data due to some error", error); 
    }
  };


  // eslint-disable-next-line
  const [Notes, setNotes] = useState([]);
  const [MyNotes, setMyNotes] = useState([]);
  const [AllNotes, setAllNotes] = useState([]);

  const [PYQS, setPYQ] = useState([]);
  const [MyPYQS, setMyPYQ] = useState([]);
  const [AllPYQS, setAllPYQ] = useState([]);

  const [Video, setVideo] = useState([]);
  const [MyVideo, setMyVideo] = useState([]);
  const [AllVideo, setAllVideo] = useState([]);

  const [LatestData, setLatestData] = useState([]);
  const [MyLearningData, setMyLearningData] = useState([]);
  const [MyLearningNotes, setMyLearningNotes] = useState([]);
  const [MyLearningVideo, setMyLearningVideo] = useState([]);
  const [MyLearningPYQ, setMyLearningPYQ] = useState([]);

  const [searchContentData, setSearchContentData] = useState([]);
  return (
    <ContentContext.Provider
      value={{ Notes, MyNotes, AllNotes, PYQS, MyPYQS, AllPYQS, Video, MyVideo, AllVideo, LatestData, addInMylearning, removeFromMylearning, getDataFromMyLearning, MyLearningNotes, MyLearningVideo, MyLearningPYQ, searchContent, setSearchContentData, searchContentData, addNote, getNote, addPYQ, getPYQ, addVideo, getVideo, getLatestUpload }}>
      {props.children}
    </ContentContext.Provider>
  );
};

export default ContentState;

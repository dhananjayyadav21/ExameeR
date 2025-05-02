import React, { useContext, useEffect } from 'react'
import NotesItem from '../components/NotesItem';
import VideoItem from '../components/VideoItem';
import QPaperItem from '../components/QPaperItem';
import ContentContext from '../context/ContentContext';

const SearchContent = ({ setProgress }) => {
    const context = useContext(ContentContext);
    const { searchContentData } = context

    //----[useEffect]---------
    useEffect(() => {
        setProgress(0);
        setProgress(100);
        // eslint-disable-next-line
    }, []);

    return (
        <div className='container-lg'>
            <div className="row px-2">
                <div className="serchContent-heroSection card container-lg my-4 shadow-sm">
                    <div className="text-center py-4">
                        <h2 className="card-title">Content Found For<span className="serchContent-span-section text-info"> Your Search </span></h2>
                        <p className="card-text">
                            "Your study material, just a click away" ||  "Instant access to the content you need." || "Smart search for smarter studies"
                        </p>
                    </div>
                </div>
                {searchContentData.length > 0 ? (
                    searchContentData.map((item, index) => {
                        switch (item.type) {
                            case 'note':
                                return (
                                    <NotesItem key={index} notes={item} />
                                );

                            case 'pyq':
                                return (
                                    <QPaperItem key={index} pyq={item} />
                                );

                            case 'video':
                                return (
                                    <VideoItem key={index} video={item} />
                                );

                            default:
                                return null;
                        }
                    })
                ) : (
                    <div className="text-center w-100">
                        <h6 className="text-muted mt-4">No content found for your search.</h6>
                    </div>
                )}
            </div>
        </div>
    );
}

export default SearchContent;

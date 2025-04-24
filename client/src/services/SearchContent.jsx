import React, { useContext } from 'react'
import NotesItem from '../components/NotesItem';
import VideoItem from '../components/VideoItem';
import QPaperItem from '../components/QPaperItem';
import ContentContext from '../context/ContentContext';

const SearchContent = () => {
    const context = useContext(ContentContext);
    const { searchContentData } = context

    return (
        <div className='container-lg'>
            <div className="row w-100">
                <div className="serchContent-heroSection card container-lg my-5 shadow-sm">
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
                                    <NotesItem key={index} Notes={item} />
                                );

                            case 'pyq':
                                return (
                                    <QPaperItem key={index} PYQ={item} />
                                );

                            case 'video':
                                return (
                                    <VideoItem key={index} Video={item} />
                                );

                            default:
                                return null;
                        }
                    })
                ) : (
                    <div className="text-center w-100">
                        <h5 className="text-muted mt-4">No content found for your search.</h5>
                    </div>
                )}
            </div>
        </div>
    );
}

export default SearchContent;

import React, { useState, useEffect } from "react";
//import Masonry from "react-masonry-css";

//this should be replaced and filled in with
const songs = [
  {
    title: "Lovin On Me",
    artis: "Jack",
    imageUrl:
      "https://imgs.search.brave.com/exXVxVttpn8_ntMruQfLOTYg_m57HXYb_RNofsrJYDo/rs:fit:500:0:0/g:ce/aHR0cHM6Ly91cGxv/YWQud2lraW1lZGlh/Lm9yZy93aWtpcGVk/aWEvZW4vdGh1bWIv/Ny83Mi8lMjJMb3Zp/bl9Pbl9NZSUyMl9i/eV9KYWNrX0hhcmxv/d18tX2NvdmVyX2Fy/dC5wbmcvNTEycHgt/JTIyTG92aW5fT25f/TWUlMjJfYnlfSmFj/a19IYXJsb3dfLV9j/b3Zlcl9hcnQucG5n",
  },
  { title: "Cruel Summer" },
  { title: "Greedy" },
  {
    title: "I Remember Everything ft..",
    imageUrl:
      "https://imgs.search.brave.com/91F6jy5Cbq4W-JNvK772QJ5-VuKjeqDAU5NBOhD_3Vs/rs:fit:860:0:0/g:ce/aHR0cHM6Ly91cGxv/YWQud2lraW1lZGlh/Lm9yZy93aWtpcGVk/aWEvZW4vdGh1bWIv/Ni82ZC9aYWNoX0Jy/eWFuXy1fSV9SZW1l/bWJlcl9FdmVyeXRo/aW5nLnBuZy81MTJw/eC1aYWNoX0JyeWFu/Xy1fSV9SZW1lbWJl/cl9FdmVyeXRoaW5n/LnBuZw",
  },
];
function truncateString(text, maxLength) {
  if (text.length > maxLength) {
    return text.substring(0, maxLength) + "...";
  }
  return text;
}
//builds template for songs
export const Song = ({ title, artist, imageUrl }) => {
  const truncatedTitle = truncateString(title, 12);
  return (
    <div className="flex flex-col box-content h-20 w-20 bg-neutral-900 border-2 border-black items-center p-3 rounded hover:bg-pink-600">
      {imageUrl && (
        <img src={imageUrl} alt={title} className="h-12 w-12 rounded mb-2" />
      )}
      <div className="text-center">
        <div className="text-sm font-semibold text-white truncate text-nowrap">
          {truncatedTitle}
        </div>
        <div className="text-xs text-gray-300 truncate ">{artist}</div>
      </div>
    </div>
  );
};

function TopSongs({ spotifyData }) {
  return (
    <div className="bg-black w-auto rounded-md">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-1 bg-neutral-900 rounded-lg">
        {songs.map(
          (
            song,
            index //songs will be replaced with spotify Data
          ) => (
            <Song key={index} {...song} />
          )
        )}
      </div>
    </div>
  );
}

export default TopSongs;

import React from "react";
const TopArtists = ({ artists }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 p-2 bg-neutral-900 rounded-lg">
      {artists &&
        artists.map((artist, index) => (
          <div
            className="flex flex-col box-content h-20 w-220 border-2 items-center justify-center bg-black rounded p-2 hover:bg-pink-600"
            key={index}
          >
            {artist.images.map((image, imgIndex) => (
              <img
                key={imgIndex}
                src={image.url}
                alt={artist.name}
                className="object-cover w-16 h-16 rounded-full"
              />
            ))}
            <h2 className="text-sm font-semibold text-white text-nowrap">
              {artist.name}
            </h2>
          </div>
        ))}
    </div>
  );
};

export default TopArtists;

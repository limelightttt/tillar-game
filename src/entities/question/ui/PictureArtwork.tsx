import { type ReactNode, type SVGProps, useId } from "react";

import type { PictureVisualKey } from "../model/types";

interface ArtworkPalette {
  readonly from: string;
  readonly to: string;
  readonly glow: string;
}

export interface PictureArtworkProps extends Omit<
  SVGProps<SVGSVGElement>,
  "aria-label" | "children" | "role" | "viewBox"
> {
  readonly visualKey: PictureVisualKey;
  readonly ariaLabel: string;
}

function getPalette(visualKey: PictureVisualKey): ArtworkPalette {
  switch (visualKey) {
    case "pacific-ocean":
    case "atlantic-ocean":
    case "dolphin":
    case "shark":
      return { from: "#073b63", to: "#159eb5", glow: "#8ce5db" };
    case "eiffel-tower":
    case "big-ben":
      return { from: "#f7c77b", to: "#e87e67", glow: "#fff1b8" };
    case "yuri-gagarin":
    case "neil-armstrong":
    case "saturn":
    case "mars":
      return { from: "#101735", to: "#49377d", glow: "#90c7ff" };
    case "colosseum":
    case "parthenon":
      return { from: "#b86f45", to: "#efc98e", glow: "#ffe7b3" };
    case "registan":
    case "ichan-kala":
    case "chorsu-bazaar":
    case "ark-bukhara":
      return { from: "#086b78", to: "#e0a654", glow: "#75e4d2" };
    case "mona-lisa":
    case "starry-night":
      return { from: "#182b57", to: "#6d8145", glow: "#f6cf55" };
    case "dutar":
    case "violin":
      return { from: "#643d2c", to: "#c9864b", glow: "#ffd58c" };
    case "shuttlecock":
    case "tennis-ball":
      return { from: "#265c60", to: "#68b779", glow: "#e7ff92" };
    case "ssd-drive":
    case "hard-disk-drive":
      return { from: "#25314f", to: "#3d7186", glow: "#66e0c2" };
    case "film-clapper":
    case "megaphone":
      return { from: "#442153", to: "#da4f69", glow: "#ffd166" };
    case "albert-einstein":
    case "isaac-newton":
      return { from: "#26335d", to: "#8d5d7f", glow: "#f4c878" };
  }
}

function OceanArtwork({ variant }: { readonly variant: "atlantic" | "pacific" }): ReactNode {
  if (variant === "pacific") {
    return (
      <>
        <path
          d="M-12 83c31-18 62-20 90-4 14 8 18 22 9 33-11 13-4 24 20 31 18 5 26 17 21 36H-12Z"
          fill="#7bcf9b"
          opacity=".85"
        />
        <path
          d="M333 64c-28 0-54 12-68 31-13 18-7 33 12 44 17 10 23 24 18 43h38Z"
          fill="#89d5a0"
          opacity=".88"
        />
        <path d="m168 55 10 14-9 9-15-8 2-12Z" fill="#d6e99c" />
        <path d="m203 111 8 9-6 13-13-3-3-12Z" fill="#d6e99c" />
        <path d="M101 151c39 17 79 20 120 5" fill="none" stroke="#a7edf0" strokeWidth="5" />
        <path d="M121 170c28 9 56 10 84 3" fill="none" stroke="#7dd7e4" strokeWidth="3" />
        <circle cx="175" cy="91" r="5" fill="#fff2a8" />
      </>
    );
  }

  return (
    <>
      <path
        d="M24 48c27 0 48 9 57 28 8 18-4 31-1 50 2 18 19 26 17 58-24-7-43-25-51-48-5-15-18-20-22-35Z"
        fill="#88d29c"
      />
      <path
        d="M248 50c30 6 52 22 57 43-16 3-27 12-31 28-4 22-18 49-40 64-12-19-12-36 0-52 10-15 7-29-7-42Z"
        fill="#a1daa0"
      />
      <path d="M132 56c22-9 45-8 68 2" fill="none" stroke="#c1f2e8" strokeWidth="4" />
      <path d="M128 78c31-10 62-8 92 5" fill="none" stroke="#82dbe3" strokeWidth="5" />
      <path d="M125 103c34-7 68-3 99 12" fill="none" stroke="#8be0e5" strokeWidth="4" />
      <path d="M126 134c31-2 57 5 82 20" fill="none" stroke="#b5eee8" strokeWidth="3" />
      <circle cx="170" cy="108" r="8" fill="#fff4ae" opacity=".9" />
    </>
  );
}

function TowerArtwork({ variant }: { readonly variant: "eiffel" | "westminster" }): ReactNode {
  if (variant === "eiffel") {
    return (
      <>
        <circle cx="254" cy="49" r="23" fill="#fff2bd" opacity=".82" />
        <path d="M0 175c52-23 101-19 151 3 59 26 113 20 169-5v47H0Z" fill="#3f7180" />
        <g fill="none" stroke="#283a49" strokeLinecap="round" strokeLinejoin="round">
          <path d="m160 29-53 159M160 29l53 159" strokeWidth="8" />
          <path d="M126 130h68M113 169h94M142 78h36" strokeWidth="6" />
          <path d="m133 105 53 22m-52 0 52-22m-65 48 79 27m-79 0 78-27" strokeWidth="3" />
          <path d="M96 190h128" strokeWidth="9" />
        </g>
        <path d="M17 157c23-19 42-17 59 3-22-4-41-2-59 7Z" fill="#315864" />
      </>
    );
  }

  return (
    <>
      <circle cx="58" cy="48" r="21" fill="#fff0b4" opacity=".8" />
      <path d="M0 181c56-23 111-18 168 1 54 18 104 17 152-5v43H0Z" fill="#765c68" />
      <g stroke="#493944" strokeLinejoin="round">
        <path d="M119 55h82v137h-82Z" fill="#c98a68" strokeWidth="6" />
        <path d="m112 56 48-38 49 38Z" fill="#59424d" strokeWidth="6" />
        <path d="M149 18V5h22v13" fill="#59424d" strokeWidth="5" />
        <path d="M106 192h108" fill="none" strokeWidth="9" />
        <circle cx="160" cy="91" r="25" fill="#f7e7bd" strokeWidth="6" />
        <path d="M160 91V76m0 15 12 8" fill="none" strokeLinecap="round" strokeWidth="4" />
        <path d="M135 128h17v34h-17zm33 0h17v34h-17z" fill="#4a5363" strokeWidth="4" />
      </g>
    </>
  );
}

function SpacePortrait({ variant }: { readonly variant: "armstrong" | "gagarin" }): ReactNode {
  const isGagarin = variant === "gagarin";

  return (
    <>
      <circle cx="54" cy="48" r="3" fill="#fff" />
      <circle cx="269" cy="59" r="4" fill="#fff" />
      <circle cx="238" cy="27" r="2" fill="#fff" />
      <path d="M26 156c83-39 177-29 269 9v55H26Z" fill={isGagarin ? "#44508b" : "#7f7f95"} />
      {!isGagarin && <circle cx="248" cy="175" r="55" fill="#b8b4c3" opacity=".35" />}
      <path
        d="M99 215c4-55 27-81 62-81 38 0 59 26 64 81Z"
        fill={isGagarin ? "#e9edf7" : "#d9dde4"}
        stroke="#fafcff"
        strokeWidth="5"
      />
      <path
        d="M111 93c0-40 21-67 50-67 31 0 52 27 52 67 0 38-21 63-52 63-29 0-50-25-50-63Z"
        fill={isGagarin ? "#f4f5f7" : "#d7dce5"}
        stroke="#fbfdff"
        strokeWidth="7"
      />
      <path
        d="M121 89c4-27 18-42 40-42 23 0 38 15 42 42-8 22-22 34-42 34-19 0-33-12-40-34Z"
        fill={isGagarin ? "#f2bf9d" : "#2f405d"}
        opacity={isGagarin ? 1 : 0.86}
      />
      {isGagarin ? (
        <>
          <path d="M113 75h96" stroke="#d64247" strokeWidth="10" />
          <path d="M143 101c11 7 23 7 35 0" fill="none" stroke="#a45e54" strokeWidth="3" />
          <circle cx="145" cy="82" r="3" fill="#29384d" />
          <circle cx="178" cy="82" r="3" fill="#29384d" />
          <circle cx="160" cy="177" r="13" fill="#de4e4e" />
        </>
      ) : (
        <>
          <path
            d="M119 88c11 16 25 24 42 24 18 0 32-8 44-24"
            fill="none"
            stroke="#92c5df"
            strokeWidth="4"
          />
          <path d="M136 172h51v27h-51Z" fill="#62758b" />
          <path d="M212 166c25-13 40-30 48-51" fill="none" stroke="#e8edf4" strokeWidth="11" />
        </>
      )}
    </>
  );
}

function AncientArtwork({ variant }: { readonly variant: "colosseum" | "parthenon" }): ReactNode {
  if (variant === "colosseum") {
    const arches = [75, 112, 149, 186, 223];

    return (
      <>
        <ellipse cx="160" cy="181" rx="128" ry="24" fill="#765040" opacity=".4" />
        <path
          d="M44 82c25-32 205-36 233 1l-9 104c-37 25-176 25-216 0Z"
          fill="#d9a06e"
          stroke="#805541"
          strokeWidth="6"
        />
        <path d="M44 84c42 19 192 19 233-1" fill="none" stroke="#f3c68f" strokeWidth="10" />
        <path
          d="M49 119c53 15 166 15 222-1M48 153c55 15 166 15 222 0"
          fill="none"
          stroke="#895d49"
          strokeWidth="5"
        />
        {arches.map((x) => (
          <path key={x} d={`M${x} 181v-17a12 12 0 0 1 24 0v21`} fill="#6d4d48" />
        ))}
        <path d="M245 78v106" stroke="#684947" strokeWidth="8" />
      </>
    );
  }

  return (
    <>
      <ellipse cx="160" cy="190" rx="124" ry="19" fill="#785a45" opacity=".35" />
      <path d="M53 82 160 30l108 52Z" fill="#efd19d" stroke="#8f6b4d" strokeWidth="7" />
      <path d="m78 78 82-34 83 34Z" fill="#c89568" />
      <path
        d="M48 82h224v17H48Zm10 88h204v20H58Z"
        fill="#f3d7a5"
        stroke="#8f6b4d"
        strokeWidth="6"
      />
      {[73, 105, 137, 169, 201, 233].map((x) => (
        <path key={x} d={`M${x} 98h19v73h-19Z`} fill="#e9c68d" stroke="#967153" strokeWidth="4" />
      ))}
      <circle cx="160" cy="65" r="8" fill="#f7e5b8" />
    </>
  );
}

function PlanetArtwork({ variant }: { readonly variant: "mars" | "saturn" }): ReactNode {
  if (variant === "saturn") {
    return (
      <>
        <circle cx="48" cy="55" r="3" fill="#fff" />
        <circle cx="266" cy="42" r="5" fill="#ffe6a1" />
        <circle cx="278" cy="160" r="2" fill="#fff" />
        <ellipse
          cx="160"
          cy="117"
          rx="122"
          ry="35"
          fill="none"
          stroke="#ead2a0"
          strokeWidth="18"
          transform="rotate(-13 160 117)"
        />
        <circle cx="160" cy="111" r="65" fill="#e9bf78" />
        <path
          d="M105 91c34 8 70 8 108-1M98 116c40 10 81 10 123-2M108 140c33 8 66 7 100-2"
          fill="none"
          stroke="#b87861"
          strokeWidth="8"
          opacity=".55"
        />
        <path d="M51 144c65 24 149 6 219-39" fill="none" stroke="#fff0c2" strokeWidth="7" />
      </>
    );
  }

  return (
    <>
      <circle cx="48" cy="52" r="3" fill="#fff" />
      <circle cx="269" cy="45" r="4" fill="#ffe8ad" />
      <circle cx="160" cy="115" r="78" fill="#d96d4a" stroke="#f5a265" strokeWidth="6" />
      <circle cx="125" cy="82" r="16" fill="#ad513d" opacity=".58" />
      <circle cx="198" cy="126" r="23" fill="#a94a39" opacity=".55" />
      <circle cx="145" cy="159" r="11" fill="#f09a62" opacity=".7" />
      <path
        d="M102 109c30 15 63 18 101 8M113 145c32 10 60 8 85-5"
        fill="none"
        stroke="#f5a065"
        strokeWidth="5"
        opacity=".6"
      />
    </>
  );
}

function SeaAnimalArtwork({ variant }: { readonly variant: "dolphin" | "shark" }): ReactNode {
  if (variant === "dolphin") {
    return (
      <>
        <path
          d="M0 153c42-16 82-15 120 2 46 21 90 18 132-7 22-13 45-17 68-12v84H0Z"
          fill="#087f9c"
        />
        <path
          d="M0 174c48-13 92-7 133 16 46 25 94 23 145-6 14-8 28-12 42-12"
          fill="none"
          stroke="#8de8e2"
          strokeWidth="8"
        />
        <path
          d="M70 137c32-47 84-62 143-39 18 7 34 5 48-7-2 18-10 31-24 39 14 6 23 18 28 34-19-7-36-17-50-30-57 34-104 35-145 3Z"
          fill="#a8dce5"
          stroke="#286d86"
          strokeLinejoin="round"
          strokeWidth="6"
        />
        <path d="M141 100c8-22 23-34 46-38-9 18-9 33 0 45" fill="#6ea9bf" />
        <circle cx="211" cy="108" r="4" fill="#183b53" />
        <path d="M214 119c8 2 15 1 21-3" fill="none" stroke="#286d86" strokeWidth="3" />
      </>
    );
  }

  return (
    <>
      <path d="M0 76c51 15 99 12 143-8 60-27 119-19 177 24v128H0Z" fill="#087894" />
      <path
        d="M37 109c52-33 115-36 189-7l48-30-10 42 24 31-54-13c-65 38-131 36-197-6Z"
        fill="#739aae"
        stroke="#244e66"
        strokeLinejoin="round"
        strokeWidth="6"
      />
      <path d="M127 95c17-29 37-42 61-40l-13 42" fill="#527c93" />
      <path d="M132 137c13 22 31 33 52 35l-9-37" fill="#527c93" />
      <circle cx="74" cy="112" r="5" fill="#172f45" />
      <path d="M56 126c18 7 37 8 57 3" fill="none" stroke="#e6f5f5" strokeWidth="4" />
      <path
        d="M0 172c47-13 93-7 137 17 50 26 104 24 162-7"
        fill="none"
        stroke="#7fd5dc"
        strokeWidth="6"
      />
    </>
  );
}

function SilkRoadArtwork({ variant }: { readonly variant: "ichan-kala" | "registan" }): ReactNode {
  if (variant === "registan") {
    return (
      <>
        <circle cx="49" cy="48" r="24" fill="#ffe1a0" opacity=".75" />
        <path d="M19 180h282v30H19Z" fill="#c99356" />
        <path d="M52 93h216v90H52Z" fill="#d7a45c" stroke="#6e5a4f" strokeWidth="5" />
        <path
          d="M82 91V58a29 29 0 0 1 58 0v33m40 0V58a29 29 0 0 1 58 0v33"
          fill="#36aab1"
          stroke="#315d68"
          strokeWidth="5"
        />
        <path
          d="M116 183v-49a44 44 0 0 1 88 0v49"
          fill="#1d6f7d"
          stroke="#665343"
          strokeWidth="6"
        />
        <path d="M126 119h68M64 110h38m116 0h38" stroke="#54d0c8" strokeWidth="7" />
        {[43, 271].map((x) => (
          <path
            key={x}
            d={`M${x} 54h19v129H${x}Z`}
            fill="#c58e52"
            stroke="#665343"
            strokeWidth="5"
          />
        ))}
      </>
    );
  }

  return (
    <>
      <circle cx="261" cy="47" r="25" fill="#ffe1a0" opacity=".78" />
      <path d="M0 177c54-22 108-18 164 7 51 23 103 22 156-4v40H0Z" fill="#a87345" />
      <path d="M20 94h190v94H20Z" fill="#cf9559" stroke="#705140" strokeWidth="6" />
      <path
        d="m20 95 30-25 31 25 31-25 31 25 31-25 36 25"
        fill="#e5b36f"
        stroke="#705140"
        strokeWidth="5"
      />
      <path
        d="M201 187V48c0-19 13-32 29-32s29 13 29 32v139Z"
        fill="#43aab0"
        stroke="#315b65"
        strokeWidth="6"
      />
      <path d="M199 64h62M204 101h53M208 139h45" stroke="#d9c577" strokeWidth="8" />
      <path d="M73 188v-41a31 31 0 0 1 62 0v41" fill="#695148" />
    </>
  );
}

function UzbekCityArtwork({ variant }: { readonly variant: "ark" | "chorsu" }): ReactNode {
  if (variant === "chorsu") {
    return (
      <>
        <circle cx="263" cy="44" r="24" fill="#ffe1a0" opacity=".8" />
        <path d="M28 176h264v34H28Z" fill="#9e754f" />
        <path d="M69 108h182v72H69Z" fill="#cfb383" stroke="#4f6d70" strokeWidth="6" />
        <path
          d="M62 111c11-58 43-88 98-88s88 30 99 88Z"
          fill="#3eb5c3"
          stroke="#2b6974"
          strokeWidth="7"
        />
        <path
          d="M89 96c18-30 42-45 71-45 30 0 54 15 72 45"
          fill="none"
          stroke="#83ded5"
          strokeWidth="8"
        />
        <path d="M105 180v-37h34v37m42 0v-37h34v37" fill="#6a6259" />
        <path d="M81 124h158" stroke="#efe0bd" strokeWidth="6" />
      </>
    );
  }

  return (
    <>
      <circle cx="57" cy="47" r="24" fill="#ffe0a1" opacity=".78" />
      <path d="M0 187c71-26 132-24 186 5 45 24 90 23 134-2v30H0Z" fill="#946747" />
      <path d="M38 97h244v96H38Z" fill="#c99465" stroke="#704f42" strokeWidth="7" />
      <path
        d="M30 98 54 68l24 30 24-30 24 30 24-30 24 30 24-30 24 30 24-30 28 30"
        fill="#e0b178"
        stroke="#704f42"
        strokeWidth="6"
      />
      <path d="M128 193v-52a32 32 0 0 1 64 0v52" fill="#594842" />
      <path d="M55 125h48v35H55zm162 0h48v35h-48z" fill="#7a6555" />
      <path d="M38 177h244" stroke="#f0cb8d" strokeWidth="6" />
    </>
  );
}

function MasterpieceArtwork({
  variant,
}: {
  readonly variant: "mona-lisa" | "starry-night";
}): ReactNode {
  if (variant === "mona-lisa") {
    return (
      <>
        <path d="M67 20h186v190H67Z" fill="#8a5b38" stroke="#f0c778" strokeWidth="10" />
        <path d="M82 35h156v160H82Z" fill="#6e8156" />
        <path d="M82 93c31-27 57-29 78-6 28-30 54-29 78 3v105H82Z" fill="#8ba17a" />
        <ellipse cx="160" cy="88" rx="30" ry="37" fill="#d9ae86" />
        <path
          d="M128 84c4-38 20-50 34-49 22 1 34 17 31 52-13-13-24-22-33-27-9 11-20 19-32 24Z"
          fill="#47352e"
        />
        <path d="M104 186c4-55 23-83 56-83 34 0 53 28 57 83Z" fill="#4b4a36" />
        <path
          d="M126 153c23 13 46 13 69 0"
          fill="none"
          stroke="#d7ae87"
          strokeLinecap="round"
          strokeWidth="11"
        />
        <path d="M148 94c8 4 16 4 24 0" fill="none" stroke="#9d6f62" strokeWidth="2" />
      </>
    );
  }

  return (
    <>
      <path d="M43 20h234v190H43Z" fill="#122756" stroke="#edc855" strokeWidth="8" />
      <circle cx="224" cy="64" r="31" fill="#ffe576" />
      {[76, 123, 168, 268].map((x, index) => (
        <path
          key={x}
          d={`M${x} ${52 + index * 17}l6 12 13 2-10 9 3 13-12-6-12 6 3-13-10-9 13-2Z`}
          fill="#f7d754"
        />
      ))}
      <path
        d="M58 73c35-28 72-30 110-7s72 23 103 1M57 107c28-20 55-19 81 2 34 27 71 27 112 1"
        fill="none"
        stroke="#6ca1d5"
        strokeLinecap="round"
        strokeWidth="11"
      />
      <path d="M42 159c57-30 106-29 147 2 35 26 64 23 88 6v43H42Z" fill="#597042" />
      <path d="M79 205c-1-61 12-101 39-120-8 33-4 61 12 83-20-7-28 6-20 37Z" fill="#152b35" />
    </>
  );
}

function InstrumentArtwork({ variant }: { readonly variant: "dutar" | "violin" }): ReactNode {
  if (variant === "dutar") {
    return (
      <g transform="rotate(-28 160 110)">
        <path
          d="M125 127c-29 16-33 53-9 72 25 21 69 4 71-29 1-22-14-40-34-46Z"
          fill="#d99753"
          stroke="#5c3928"
          strokeWidth="7"
        />
        <path d="M144 129 194 28l15 7-41 104Z" fill="#b77742" stroke="#5c3928" strokeWidth="6" />
        <path d="m191 30 13-20 26 13-17 18Z" fill="#6b432e" />
        <circle cx="151" cy="166" r="10" fill="#5c3928" />
        <path d="m150 153 50-119m-42 123 48-120" stroke="#ffe4ad" strokeWidth="2" />
        <path d="M123 173c21 10 39 9 57-3" fill="none" stroke="#f3bd72" strokeWidth="5" />
      </g>
    );
  }

  return (
    <>
      <g transform="rotate(24 150 112)">
        <path
          d="M140 78c-17 17-18 34-4 51-23 14-29 34-15 54 15 22 42 18 54-5 12 23 39 27 54 5 14-20 8-40-15-54 14-17 13-34-4-51-14 12-26 15-35 8-9 7-21 4-35-8Z"
          fill="#c66d35"
          stroke="#5a3328"
          strokeWidth="6"
        />
        <path d="M168 91V24h15v67" fill="#8a4d30" stroke="#5a3328" strokeWidth="5" />
        <path d="m165 27 4-18h19l-2 20Z" fill="#5a3328" />
        <path d="M175 32v148" stroke="#ffe6b6" strokeWidth="3" />
        <path d="M158 143h34" stroke="#543328" strokeWidth="7" />
        <path
          d="M151 110c-11-5-17 2-10 13m68-13c11-5 17 2 10 13"
          fill="none"
          stroke="#5a3328"
          strokeWidth="4"
        />
      </g>
      <path d="M71 187 244 43" stroke="#ead5b1" strokeLinecap="round" strokeWidth="5" />
    </>
  );
}

function SportObjectArtwork({
  variant,
}: {
  readonly variant: "shuttlecock" | "tennis-ball";
}): ReactNode {
  if (variant === "shuttlecock") {
    return (
      <g transform="rotate(-27 160 110)">
        <path
          d="M119 38c28 22 53 22 79 0l-12 95h-54Z"
          fill="#f8f4df"
          stroke="#3c6867"
          strokeLinejoin="round"
          strokeWidth="6"
        />
        <path d="m137 42 7 91m17-88v88m28-91-13 91" stroke="#9bc6bb" strokeWidth="5" />
        <path
          d="M130 131h58v22c0 20-13 34-29 34s-29-14-29-34Z"
          fill="#e9d5af"
          stroke="#5c6d62"
          strokeWidth="6"
        />
        <path d="M132 145h54" stroke="#f7f3d8" strokeWidth="6" />
      </g>
    );
  }

  return (
    <>
      <circle cx="160" cy="112" r="79" fill="#d8ee4f" stroke="#68824a" strokeWidth="7" />
      <path
        d="M93 70c35 13 48 39 39 79-4 17 3 31 20 43M228 68c-35 15-47 42-36 81 5 18-2 32-19 43"
        fill="none"
        stroke="#fffce5"
        strokeWidth="9"
      />
      <path
        d="M111 54c25-16 52-20 81-10"
        fill="none"
        stroke="#efff91"
        strokeWidth="5"
        opacity=".8"
      />
    </>
  );
}

function StorageArtwork({ variant }: { readonly variant: "hdd" | "ssd" }): ReactNode {
  if (variant === "ssd") {
    return (
      <>
        <rect
          x="45"
          y="37"
          width="230"
          height="155"
          rx="19"
          fill="#246c62"
          stroke="#102f3d"
          strokeWidth="8"
        />
        <path d="M58 53h204v122H58Z" fill="#174f4e" />
        {[78, 132, 186].map((x) => (
          <rect
            key={x}
            x={x}
            y="74"
            width="40"
            height="47"
            rx="5"
            fill="#1c2938"
            stroke="#68d9b9"
            strokeWidth="4"
          />
        ))}
        <rect x="92" y="139" width="136" height="20" rx="5" fill="#2f3b4e" />
        <path d="M65 66h29m132 0h29M66 166h31m126 0h31" stroke="#8be8c7" strokeWidth="4" />
        {[70, 86, 102, 218, 234, 250].map((x) => (
          <circle key={x} cx={x} cy="181" r="4" fill="#e6bd68" />
        ))}
      </>
    );
  }

  return (
    <>
      <rect
        x="48"
        y="31"
        width="224"
        height="170"
        rx="19"
        fill="#d8dde2"
        stroke="#253444"
        strokeWidth="8"
      />
      <circle cx="143" cy="113" r="62" fill="#8fa6b2" stroke="#344958" strokeWidth="7" />
      <circle cx="143" cy="113" r="43" fill="#d8edf0" />
      <circle cx="143" cy="113" r="14" fill="#415d69" />
      <path d="m238 61-54 83" stroke="#2d3b48" strokeLinecap="round" strokeWidth="14" />
      <path d="m182 143-18 20 27 8 7-25Z" fill="#536977" stroke="#263947" strokeWidth="5" />
      <circle cx="68" cy="52" r="6" fill="#70848f" />
      <circle cx="251" cy="181" r="6" fill="#70848f" />
    </>
  );
}

function CinemaToolArtwork({ variant }: { readonly variant: "clapper" | "megaphone" }): ReactNode {
  if (variant === "clapper") {
    return (
      <g transform="rotate(-7 160 110)">
        <path d="M62 82h202v111H62Z" fill="#252b3d" stroke="#f6e8d2" strokeWidth="7" />
        <path d="M53 46h211v42H53Z" fill="#f6e8d2" stroke="#252b3d" strokeWidth="7" />
        {[58, 104, 150, 196, 242].map((x) => (
          <path key={x} d={`m${x} 48 24 38h22l-24-38Z`} fill="#252b3d" />
        ))}
        <path
          d="M81 111h68m-68 27h152m-152 28h106"
          stroke="#f6e8d2"
          strokeLinecap="round"
          strokeWidth="7"
        />
        <circle cx="241" cy="169" r="11" fill="#e6576d" />
      </g>
    );
  }

  return (
    <>
      <path d="M71 98h53v54H71Z" fill="#ece4d8" stroke="#3a2940" strokeWidth="7" />
      <path
        d="m122 91 128-49v164l-128-47Z"
        fill="#ef6375"
        stroke="#3a2940"
        strokeLinejoin="round"
        strokeWidth="8"
      />
      <path d="m87 153 14 51h43l-19-51Z" fill="#d9b4a9" stroke="#3a2940" strokeWidth="7" />
      <path
        d="M261 70c21 18 21 42 0 62m15-83c35 31 35 70 0 103"
        fill="none"
        stroke="#ffd983"
        strokeLinecap="round"
        strokeWidth="8"
      />
      <circle cx="97" cy="125" r="8" fill="#8d4056" />
    </>
  );
}

function ScientistArtwork({ variant }: { readonly variant: "einstein" | "newton" }): ReactNode {
  const isEinstein = variant === "einstein";

  return (
    <>
      {isEinstein ? (
        <>
          <ellipse
            cx="67"
            cy="60"
            rx="39"
            ry="13"
            fill="none"
            stroke="#80d4dc"
            strokeWidth="4"
            transform="rotate(-24 67 60)"
          />
          <ellipse
            cx="67"
            cy="60"
            rx="39"
            ry="13"
            fill="none"
            stroke="#80d4dc"
            strokeWidth="4"
            transform="rotate(35 67 60)"
          />
          <circle cx="67" cy="60" r="6" fill="#f1d069" />
        </>
      ) : (
        <>
          <path d="M53 79c20-28 37-27 52 3" fill="none" stroke="#91d4d8" strokeWidth="5" />
          <path d="m77 39 11 21-20 9-10-18Z" fill="#ea5c59" />
          <path d="M78 38c6-10 13-13 22-9" fill="none" stroke="#6d5136" strokeWidth="4" />
        </>
      )}
      <path
        d="M82 215c8-53 35-82 79-82 45 0 71 29 78 82Z"
        fill={isEinstein ? "#37445b" : "#6e514f"}
      />
      <ellipse cx="160" cy="97" rx="46" ry="56" fill="#dfad88" />
      {isEinstein ? (
        <>
          <path
            d="M116 76 96 60l23-4-11-21 27 10 6-26 19 22 21-22 5 27 29-9-12 23 24 3-22 17c-20-16-51-19-89-4Z"
            fill="#e8e5dc"
          />
          <path d="M127 91h28m10 0h28" stroke="#3e3340" strokeWidth="5" />
          <circle cx="141" cy="91" r="13" fill="none" stroke="#3e3340" strokeWidth="4" />
          <circle cx="179" cy="91" r="13" fill="none" stroke="#3e3340" strokeWidth="4" />
          <path
            d="M142 124c12-7 24-7 36 0"
            fill="none"
            stroke="#e9e5dc"
            strokeLinecap="round"
            strokeWidth="10"
          />
        </>
      ) : (
        <>
          <path
            d="M112 82c1-36 21-59 48-59 30 0 50 24 49 62-9-13-17-22-25-27-9 13-22 18-38 14-10 11-21 15-34 10Z"
            fill="#d7b78b"
          />
          <path
            d="M115 79c-17 17-14 38 8 45-10 17-1 32 20 33m61-78c17 17 14 38-8 45 10 17 1 32-20 33"
            fill="none"
            stroke="#d7b78b"
            strokeWidth="12"
          />
          <path d="M145 121c10 4 20 4 30 0" fill="none" stroke="#9a665d" strokeWidth="3" />
          <path d="M119 166h82" stroke="#efe0c7" strokeWidth="12" />
        </>
      )}
    </>
  );
}

function renderArtwork(visualKey: PictureVisualKey): ReactNode {
  switch (visualKey) {
    case "pacific-ocean":
      return <OceanArtwork variant="pacific" />;
    case "atlantic-ocean":
      return <OceanArtwork variant="atlantic" />;
    case "eiffel-tower":
      return <TowerArtwork variant="eiffel" />;
    case "big-ben":
      return <TowerArtwork variant="westminster" />;
    case "yuri-gagarin":
      return <SpacePortrait variant="gagarin" />;
    case "neil-armstrong":
      return <SpacePortrait variant="armstrong" />;
    case "colosseum":
      return <AncientArtwork variant="colosseum" />;
    case "parthenon":
      return <AncientArtwork variant="parthenon" />;
    case "saturn":
      return <PlanetArtwork variant="saturn" />;
    case "mars":
      return <PlanetArtwork variant="mars" />;
    case "dolphin":
      return <SeaAnimalArtwork variant="dolphin" />;
    case "shark":
      return <SeaAnimalArtwork variant="shark" />;
    case "registan":
      return <SilkRoadArtwork variant="registan" />;
    case "ichan-kala":
      return <SilkRoadArtwork variant="ichan-kala" />;
    case "chorsu-bazaar":
      return <UzbekCityArtwork variant="chorsu" />;
    case "ark-bukhara":
      return <UzbekCityArtwork variant="ark" />;
    case "mona-lisa":
      return <MasterpieceArtwork variant="mona-lisa" />;
    case "starry-night":
      return <MasterpieceArtwork variant="starry-night" />;
    case "dutar":
      return <InstrumentArtwork variant="dutar" />;
    case "violin":
      return <InstrumentArtwork variant="violin" />;
    case "shuttlecock":
      return <SportObjectArtwork variant="shuttlecock" />;
    case "tennis-ball":
      return <SportObjectArtwork variant="tennis-ball" />;
    case "ssd-drive":
      return <StorageArtwork variant="ssd" />;
    case "hard-disk-drive":
      return <StorageArtwork variant="hdd" />;
    case "film-clapper":
      return <CinemaToolArtwork variant="clapper" />;
    case "megaphone":
      return <CinemaToolArtwork variant="megaphone" />;
    case "albert-einstein":
      return <ScientistArtwork variant="einstein" />;
    case "isaac-newton":
      return <ScientistArtwork variant="newton" />;
  }
}

export function PictureArtwork({
  visualKey,
  ariaLabel,
  ...svgProps
}: PictureArtworkProps): ReactNode {
  const rawId = useId().replaceAll(":", "");
  const backgroundGradientId = `picture-background-${rawId}`;
  const glowGradientId = `picture-glow-${rawId}`;
  const shadowId = `picture-shadow-${rawId}`;
  const palette = getPalette(visualKey);

  return (
    <svg
      {...svgProps}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 320 220"
      role="img"
      aria-label={ariaLabel}
      focusable="false"
    >
      <title>{ariaLabel}</title>
      <defs>
        <linearGradient id={backgroundGradientId} x1="0" y1="0" x2="1" y2="1">
          <stop stopColor={palette.from} />
          <stop offset="1" stopColor={palette.to} />
        </linearGradient>
        <radialGradient id={glowGradientId} cx=".25" cy=".18" r=".8">
          <stop stopColor={palette.glow} stopOpacity=".42" />
          <stop offset="1" stopColor={palette.glow} stopOpacity="0" />
        </radialGradient>
        <filter id={shadowId} x="-20%" y="-20%" width="140%" height="150%">
          <feDropShadow dx="0" dy="7" stdDeviation="6" floodColor="#061424" floodOpacity=".32" />
        </filter>
      </defs>
      <rect width="320" height="220" rx="24" fill={`url(#${backgroundGradientId})`} />
      <rect width="320" height="220" rx="24" fill={`url(#${glowGradientId})`} />
      <circle cx="286" cy="24" r="52" fill="#fff" opacity=".05" />
      <circle cx="24" cy="208" r="67" fill="#fff" opacity=".04" />
      <g filter={`url(#${shadowId})`}>{renderArtwork(visualKey)}</g>
      <rect
        x="3"
        y="3"
        width="314"
        height="214"
        rx="21"
        fill="none"
        stroke="#fff"
        strokeOpacity=".18"
        strokeWidth="2"
      />
    </svg>
  );
}

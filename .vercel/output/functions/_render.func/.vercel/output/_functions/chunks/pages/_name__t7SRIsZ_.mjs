/* empty css                          */
import { A as AstroError, c as InvalidImageService, d as ExpectedImageOptions, E as ExpectedImage, F as FailedToFetchRemoteImageDimensions, e as createComponent, f as ImageMissingAlt, r as renderTemplate, m as maybeRenderHead, g as addAttribute, s as spreadAttributes, h as createAstro, i as renderComponent, j as renderHead, k as renderSlot } from '../astro_DYzw0DtZ.mjs';
import 'kleur/colors';
import 'html-escaper';
/* empty css                           */
/* empty css                           */
import { r as resolveSrc, i as isRemoteImage, a as isESMImportedImage, b as isLocalService, D as DEFAULT_HASH_PROPS } from '../astro/assets-service_QdkxcCwb.mjs';
import 'clsx';
import { jsx, Fragment, jsxs } from 'react/jsx-runtime';
import { useState } from 'react';
import { FaBars, FaFacebook, FaInstagram, FaWhatsapp } from 'react-icons/fa';
import { IoCloseSharp } from 'react-icons/io5';
import { BsInstagram } from 'react-icons/bs';
import { Analytics } from '@vercel/analytics/react';
import { IoMdMail } from 'react-icons/io';
/* empty css                           */

const decoder = new TextDecoder();
const toUTF8String = (input, start = 0, end = input.length) => decoder.decode(input.slice(start, end));
const toHexString = (input, start = 0, end = input.length) => input.slice(start, end).reduce((memo, i) => memo + ("0" + i.toString(16)).slice(-2), "");
const readInt16LE = (input, offset = 0) => {
  const val = input[offset] + input[offset + 1] * 2 ** 8;
  return val | (val & 2 ** 15) * 131070;
};
const readUInt16BE = (input, offset = 0) => input[offset] * 2 ** 8 + input[offset + 1];
const readUInt16LE = (input, offset = 0) => input[offset] + input[offset + 1] * 2 ** 8;
const readUInt24LE = (input, offset = 0) => input[offset] + input[offset + 1] * 2 ** 8 + input[offset + 2] * 2 ** 16;
const readInt32LE = (input, offset = 0) => input[offset] + input[offset + 1] * 2 ** 8 + input[offset + 2] * 2 ** 16 + (input[offset + 3] << 24);
const readUInt32BE = (input, offset = 0) => input[offset] * 2 ** 24 + input[offset + 1] * 2 ** 16 + input[offset + 2] * 2 ** 8 + input[offset + 3];
const readUInt32LE = (input, offset = 0) => input[offset] + input[offset + 1] * 2 ** 8 + input[offset + 2] * 2 ** 16 + input[offset + 3] * 2 ** 24;
const methods = {
  readUInt16BE,
  readUInt16LE,
  readUInt32BE,
  readUInt32LE
};
function readUInt(input, bits, offset, isBigEndian) {
  offset = offset || 0;
  const endian = isBigEndian ? "BE" : "LE";
  const methodName = "readUInt" + bits + endian;
  return methods[methodName](input, offset);
}
function readBox(buffer, offset) {
  if (buffer.length - offset < 4)
    return;
  const boxSize = readUInt32BE(buffer, offset);
  if (buffer.length - offset < boxSize)
    return;
  return {
    name: toUTF8String(buffer, 4 + offset, 8 + offset),
    offset,
    size: boxSize
  };
}
function findBox(buffer, boxName, offset) {
  while (offset < buffer.length) {
    const box = readBox(buffer, offset);
    if (!box)
      break;
    if (box.name === boxName)
      return box;
    offset += box.size;
  }
}

const BMP = {
  validate: (input) => toUTF8String(input, 0, 2) === "BM",
  calculate: (input) => ({
    height: Math.abs(readInt32LE(input, 22)),
    width: readUInt32LE(input, 18)
  })
};

const TYPE_ICON = 1;
const SIZE_HEADER$1 = 2 + 2 + 2;
const SIZE_IMAGE_ENTRY = 1 + 1 + 1 + 1 + 2 + 2 + 4 + 4;
function getSizeFromOffset(input, offset) {
  const value = input[offset];
  return value === 0 ? 256 : value;
}
function getImageSize$1(input, imageIndex) {
  const offset = SIZE_HEADER$1 + imageIndex * SIZE_IMAGE_ENTRY;
  return {
    height: getSizeFromOffset(input, offset + 1),
    width: getSizeFromOffset(input, offset)
  };
}
const ICO = {
  validate(input) {
    const reserved = readUInt16LE(input, 0);
    const imageCount = readUInt16LE(input, 4);
    if (reserved !== 0 || imageCount === 0)
      return false;
    const imageType = readUInt16LE(input, 2);
    return imageType === TYPE_ICON;
  },
  calculate(input) {
    const nbImages = readUInt16LE(input, 4);
    const imageSize = getImageSize$1(input, 0);
    if (nbImages === 1)
      return imageSize;
    const imgs = [imageSize];
    for (let imageIndex = 1; imageIndex < nbImages; imageIndex += 1) {
      imgs.push(getImageSize$1(input, imageIndex));
    }
    return {
      height: imageSize.height,
      images: imgs,
      width: imageSize.width
    };
  }
};

const TYPE_CURSOR = 2;
const CUR = {
  validate(input) {
    const reserved = readUInt16LE(input, 0);
    const imageCount = readUInt16LE(input, 4);
    if (reserved !== 0 || imageCount === 0)
      return false;
    const imageType = readUInt16LE(input, 2);
    return imageType === TYPE_CURSOR;
  },
  calculate: (input) => ICO.calculate(input)
};

const DDS = {
  validate: (input) => readUInt32LE(input, 0) === 542327876,
  calculate: (input) => ({
    height: readUInt32LE(input, 12),
    width: readUInt32LE(input, 16)
  })
};

const gifRegexp = /^GIF8[79]a/;
const GIF = {
  validate: (input) => gifRegexp.test(toUTF8String(input, 0, 6)),
  calculate: (input) => ({
    height: readUInt16LE(input, 8),
    width: readUInt16LE(input, 6)
  })
};

const brandMap = {
  avif: "avif",
  mif1: "heif",
  msf1: "heif",
  // hief-sequence
  heic: "heic",
  heix: "heic",
  hevc: "heic",
  // heic-sequence
  hevx: "heic"
  // heic-sequence
};
function detectBrands(buffer, start, end) {
  let brandsDetected = {};
  for (let i = start; i <= end; i += 4) {
    const brand = toUTF8String(buffer, i, i + 4);
    if (brand in brandMap) {
      brandsDetected[brand] = 1;
    }
  }
  if ("avif" in brandsDetected) {
    return "avif";
  } else if ("heic" in brandsDetected || "heix" in brandsDetected || "hevc" in brandsDetected || "hevx" in brandsDetected) {
    return "heic";
  } else if ("mif1" in brandsDetected || "msf1" in brandsDetected) {
    return "heif";
  }
}
const HEIF = {
  validate(buffer) {
    const ftype = toUTF8String(buffer, 4, 8);
    const brand = toUTF8String(buffer, 8, 12);
    return "ftyp" === ftype && brand in brandMap;
  },
  calculate(buffer) {
    const metaBox = findBox(buffer, "meta", 0);
    const iprpBox = metaBox && findBox(buffer, "iprp", metaBox.offset + 12);
    const ipcoBox = iprpBox && findBox(buffer, "ipco", iprpBox.offset + 8);
    const ispeBox = ipcoBox && findBox(buffer, "ispe", ipcoBox.offset + 8);
    if (ispeBox) {
      return {
        height: readUInt32BE(buffer, ispeBox.offset + 16),
        width: readUInt32BE(buffer, ispeBox.offset + 12),
        type: detectBrands(buffer, 8, metaBox.offset)
      };
    }
    throw new TypeError("Invalid HEIF, no size found");
  }
};

const SIZE_HEADER = 4 + 4;
const FILE_LENGTH_OFFSET = 4;
const ENTRY_LENGTH_OFFSET = 4;
const ICON_TYPE_SIZE = {
  ICON: 32,
  "ICN#": 32,
  // m => 16 x 16
  "icm#": 16,
  icm4: 16,
  icm8: 16,
  // s => 16 x 16
  "ics#": 16,
  ics4: 16,
  ics8: 16,
  is32: 16,
  s8mk: 16,
  icp4: 16,
  // l => 32 x 32
  icl4: 32,
  icl8: 32,
  il32: 32,
  l8mk: 32,
  icp5: 32,
  ic11: 32,
  // h => 48 x 48
  ich4: 48,
  ich8: 48,
  ih32: 48,
  h8mk: 48,
  // . => 64 x 64
  icp6: 64,
  ic12: 32,
  // t => 128 x 128
  it32: 128,
  t8mk: 128,
  ic07: 128,
  // . => 256 x 256
  ic08: 256,
  ic13: 256,
  // . => 512 x 512
  ic09: 512,
  ic14: 512,
  // . => 1024 x 1024
  ic10: 1024
};
function readImageHeader(input, imageOffset) {
  const imageLengthOffset = imageOffset + ENTRY_LENGTH_OFFSET;
  return [
    toUTF8String(input, imageOffset, imageLengthOffset),
    readUInt32BE(input, imageLengthOffset)
  ];
}
function getImageSize(type) {
  const size = ICON_TYPE_SIZE[type];
  return { width: size, height: size, type };
}
const ICNS = {
  validate: (input) => toUTF8String(input, 0, 4) === "icns",
  calculate(input) {
    const inputLength = input.length;
    const fileLength = readUInt32BE(input, FILE_LENGTH_OFFSET);
    let imageOffset = SIZE_HEADER;
    let imageHeader = readImageHeader(input, imageOffset);
    let imageSize = getImageSize(imageHeader[0]);
    imageOffset += imageHeader[1];
    if (imageOffset === fileLength)
      return imageSize;
    const result = {
      height: imageSize.height,
      images: [imageSize],
      width: imageSize.width
    };
    while (imageOffset < fileLength && imageOffset < inputLength) {
      imageHeader = readImageHeader(input, imageOffset);
      imageSize = getImageSize(imageHeader[0]);
      imageOffset += imageHeader[1];
      result.images.push(imageSize);
    }
    return result;
  }
};

const J2C = {
  // TODO: this doesn't seem right. SIZ marker doesn't have to be right after the SOC
  validate: (input) => toHexString(input, 0, 4) === "ff4fff51",
  calculate: (input) => ({
    height: readUInt32BE(input, 12),
    width: readUInt32BE(input, 8)
  })
};

const JP2 = {
  validate(input) {
    if (readUInt32BE(input, 4) !== 1783636e3 || readUInt32BE(input, 0) < 1)
      return false;
    const ftypBox = findBox(input, "ftyp", 0);
    if (!ftypBox)
      return false;
    return readUInt32BE(input, ftypBox.offset + 4) === 1718909296;
  },
  calculate(input) {
    const jp2hBox = findBox(input, "jp2h", 0);
    const ihdrBox = jp2hBox && findBox(input, "ihdr", jp2hBox.offset + 8);
    if (ihdrBox) {
      return {
        height: readUInt32BE(input, ihdrBox.offset + 8),
        width: readUInt32BE(input, ihdrBox.offset + 12)
      };
    }
    throw new TypeError("Unsupported JPEG 2000 format");
  }
};

const EXIF_MARKER = "45786966";
const APP1_DATA_SIZE_BYTES = 2;
const EXIF_HEADER_BYTES = 6;
const TIFF_BYTE_ALIGN_BYTES = 2;
const BIG_ENDIAN_BYTE_ALIGN = "4d4d";
const LITTLE_ENDIAN_BYTE_ALIGN = "4949";
const IDF_ENTRY_BYTES = 12;
const NUM_DIRECTORY_ENTRIES_BYTES = 2;
function isEXIF(input) {
  return toHexString(input, 2, 6) === EXIF_MARKER;
}
function extractSize(input, index) {
  return {
    height: readUInt16BE(input, index),
    width: readUInt16BE(input, index + 2)
  };
}
function extractOrientation(exifBlock, isBigEndian) {
  const idfOffset = 8;
  const offset = EXIF_HEADER_BYTES + idfOffset;
  const idfDirectoryEntries = readUInt(exifBlock, 16, offset, isBigEndian);
  for (let directoryEntryNumber = 0; directoryEntryNumber < idfDirectoryEntries; directoryEntryNumber++) {
    const start = offset + NUM_DIRECTORY_ENTRIES_BYTES + directoryEntryNumber * IDF_ENTRY_BYTES;
    const end = start + IDF_ENTRY_BYTES;
    if (start > exifBlock.length) {
      return;
    }
    const block = exifBlock.slice(start, end);
    const tagNumber = readUInt(block, 16, 0, isBigEndian);
    if (tagNumber === 274) {
      const dataFormat = readUInt(block, 16, 2, isBigEndian);
      if (dataFormat !== 3) {
        return;
      }
      const numberOfComponents = readUInt(block, 32, 4, isBigEndian);
      if (numberOfComponents !== 1) {
        return;
      }
      return readUInt(block, 16, 8, isBigEndian);
    }
  }
}
function validateExifBlock(input, index) {
  const exifBlock = input.slice(APP1_DATA_SIZE_BYTES, index);
  const byteAlign = toHexString(
    exifBlock,
    EXIF_HEADER_BYTES,
    EXIF_HEADER_BYTES + TIFF_BYTE_ALIGN_BYTES
  );
  const isBigEndian = byteAlign === BIG_ENDIAN_BYTE_ALIGN;
  const isLittleEndian = byteAlign === LITTLE_ENDIAN_BYTE_ALIGN;
  if (isBigEndian || isLittleEndian) {
    return extractOrientation(exifBlock, isBigEndian);
  }
}
function validateInput(input, index) {
  if (index > input.length) {
    throw new TypeError("Corrupt JPG, exceeded buffer limits");
  }
}
const JPG = {
  validate: (input) => toHexString(input, 0, 2) === "ffd8",
  calculate(input) {
    input = input.slice(4);
    let orientation;
    let next;
    while (input.length) {
      const i = readUInt16BE(input, 0);
      if (input[i] !== 255) {
        input = input.slice(1);
        continue;
      }
      if (isEXIF(input)) {
        orientation = validateExifBlock(input, i);
      }
      validateInput(input, i);
      next = input[i + 1];
      if (next === 192 || next === 193 || next === 194) {
        const size = extractSize(input, i + 5);
        if (!orientation) {
          return size;
        }
        return {
          height: size.height,
          orientation,
          width: size.width
        };
      }
      input = input.slice(i + 2);
    }
    throw new TypeError("Invalid JPG, no size found");
  }
};

const KTX = {
  validate: (input) => {
    const signature = toUTF8String(input, 1, 7);
    return ["KTX 11", "KTX 20"].includes(signature);
  },
  calculate: (input) => {
    const type = input[5] === 49 ? "ktx" : "ktx2";
    const offset = type === "ktx" ? 36 : 20;
    return {
      height: readUInt32LE(input, offset + 4),
      width: readUInt32LE(input, offset),
      type
    };
  }
};

const pngSignature = "PNG\r\n\n";
const pngImageHeaderChunkName = "IHDR";
const pngFriedChunkName = "CgBI";
const PNG = {
  validate(input) {
    if (pngSignature === toUTF8String(input, 1, 8)) {
      let chunkName = toUTF8String(input, 12, 16);
      if (chunkName === pngFriedChunkName) {
        chunkName = toUTF8String(input, 28, 32);
      }
      if (chunkName !== pngImageHeaderChunkName) {
        throw new TypeError("Invalid PNG");
      }
      return true;
    }
    return false;
  },
  calculate(input) {
    if (toUTF8String(input, 12, 16) === pngFriedChunkName) {
      return {
        height: readUInt32BE(input, 36),
        width: readUInt32BE(input, 32)
      };
    }
    return {
      height: readUInt32BE(input, 20),
      width: readUInt32BE(input, 16)
    };
  }
};

const PNMTypes = {
  P1: "pbm/ascii",
  P2: "pgm/ascii",
  P3: "ppm/ascii",
  P4: "pbm",
  P5: "pgm",
  P6: "ppm",
  P7: "pam",
  PF: "pfm"
};
const handlers = {
  default: (lines) => {
    let dimensions = [];
    while (lines.length > 0) {
      const line = lines.shift();
      if (line[0] === "#") {
        continue;
      }
      dimensions = line.split(" ");
      break;
    }
    if (dimensions.length === 2) {
      return {
        height: parseInt(dimensions[1], 10),
        width: parseInt(dimensions[0], 10)
      };
    } else {
      throw new TypeError("Invalid PNM");
    }
  },
  pam: (lines) => {
    const size = {};
    while (lines.length > 0) {
      const line = lines.shift();
      if (line.length > 16 || line.charCodeAt(0) > 128) {
        continue;
      }
      const [key, value] = line.split(" ");
      if (key && value) {
        size[key.toLowerCase()] = parseInt(value, 10);
      }
      if (size.height && size.width) {
        break;
      }
    }
    if (size.height && size.width) {
      return {
        height: size.height,
        width: size.width
      };
    } else {
      throw new TypeError("Invalid PAM");
    }
  }
};
const PNM = {
  validate: (input) => toUTF8String(input, 0, 2) in PNMTypes,
  calculate(input) {
    const signature = toUTF8String(input, 0, 2);
    const type = PNMTypes[signature];
    const lines = toUTF8String(input, 3).split(/[\r\n]+/);
    const handler = handlers[type] || handlers.default;
    return handler(lines);
  }
};

const PSD = {
  validate: (input) => toUTF8String(input, 0, 4) === "8BPS",
  calculate: (input) => ({
    height: readUInt32BE(input, 14),
    width: readUInt32BE(input, 18)
  })
};

const svgReg = /<svg\s([^>"']|"[^"]*"|'[^']*')*>/;
const extractorRegExps = {
  height: /\sheight=(['"])([^%]+?)\1/,
  root: svgReg,
  viewbox: /\sviewBox=(['"])(.+?)\1/i,
  width: /\swidth=(['"])([^%]+?)\1/
};
const INCH_CM = 2.54;
const units = {
  in: 96,
  cm: 96 / INCH_CM,
  em: 16,
  ex: 8,
  m: 96 / INCH_CM * 100,
  mm: 96 / INCH_CM / 10,
  pc: 96 / 72 / 12,
  pt: 96 / 72,
  px: 1
};
const unitsReg = new RegExp(
  `^([0-9.]+(?:e\\d+)?)(${Object.keys(units).join("|")})?$`
);
function parseLength(len) {
  const m = unitsReg.exec(len);
  if (!m) {
    return void 0;
  }
  return Math.round(Number(m[1]) * (units[m[2]] || 1));
}
function parseViewbox(viewbox) {
  const bounds = viewbox.split(" ");
  return {
    height: parseLength(bounds[3]),
    width: parseLength(bounds[2])
  };
}
function parseAttributes(root) {
  const width = root.match(extractorRegExps.width);
  const height = root.match(extractorRegExps.height);
  const viewbox = root.match(extractorRegExps.viewbox);
  return {
    height: height && parseLength(height[2]),
    viewbox: viewbox && parseViewbox(viewbox[2]),
    width: width && parseLength(width[2])
  };
}
function calculateByDimensions(attrs) {
  return {
    height: attrs.height,
    width: attrs.width
  };
}
function calculateByViewbox(attrs, viewbox) {
  const ratio = viewbox.width / viewbox.height;
  if (attrs.width) {
    return {
      height: Math.floor(attrs.width / ratio),
      width: attrs.width
    };
  }
  if (attrs.height) {
    return {
      height: attrs.height,
      width: Math.floor(attrs.height * ratio)
    };
  }
  return {
    height: viewbox.height,
    width: viewbox.width
  };
}
const SVG = {
  // Scan only the first kilo-byte to speed up the check on larger files
  validate: (input) => svgReg.test(toUTF8String(input, 0, 1e3)),
  calculate(input) {
    const root = toUTF8String(input).match(extractorRegExps.root);
    if (root) {
      const attrs = parseAttributes(root[0]);
      if (attrs.width && attrs.height) {
        return calculateByDimensions(attrs);
      }
      if (attrs.viewbox) {
        return calculateByViewbox(attrs, attrs.viewbox);
      }
    }
    throw new TypeError("Invalid SVG");
  }
};

const TGA = {
  validate(input) {
    return readUInt16LE(input, 0) === 0 && readUInt16LE(input, 4) === 0;
  },
  calculate(input) {
    return {
      height: readUInt16LE(input, 14),
      width: readUInt16LE(input, 12)
    };
  }
};

function readIFD(input, isBigEndian) {
  const ifdOffset = readUInt(input, 32, 4, isBigEndian);
  return input.slice(ifdOffset + 2);
}
function readValue(input, isBigEndian) {
  const low = readUInt(input, 16, 8, isBigEndian);
  const high = readUInt(input, 16, 10, isBigEndian);
  return (high << 16) + low;
}
function nextTag(input) {
  if (input.length > 24) {
    return input.slice(12);
  }
}
function extractTags(input, isBigEndian) {
  const tags = {};
  let temp = input;
  while (temp && temp.length) {
    const code = readUInt(temp, 16, 0, isBigEndian);
    const type = readUInt(temp, 16, 2, isBigEndian);
    const length = readUInt(temp, 32, 4, isBigEndian);
    if (code === 0) {
      break;
    } else {
      if (length === 1 && (type === 3 || type === 4)) {
        tags[code] = readValue(temp, isBigEndian);
      }
      temp = nextTag(temp);
    }
  }
  return tags;
}
function determineEndianness(input) {
  const signature = toUTF8String(input, 0, 2);
  if ("II" === signature) {
    return "LE";
  } else if ("MM" === signature) {
    return "BE";
  }
}
const signatures = [
  // '492049', // currently not supported
  "49492a00",
  // Little endian
  "4d4d002a"
  // Big Endian
  // '4d4d002a', // BigTIFF > 4GB. currently not supported
];
const TIFF = {
  validate: (input) => signatures.includes(toHexString(input, 0, 4)),
  calculate(input) {
    const isBigEndian = determineEndianness(input) === "BE";
    const ifdBuffer = readIFD(input, isBigEndian);
    const tags = extractTags(ifdBuffer, isBigEndian);
    const width = tags[256];
    const height = tags[257];
    if (!width || !height) {
      throw new TypeError("Invalid Tiff. Missing tags");
    }
    return { height, width };
  }
};

function calculateExtended(input) {
  return {
    height: 1 + readUInt24LE(input, 7),
    width: 1 + readUInt24LE(input, 4)
  };
}
function calculateLossless(input) {
  return {
    height: 1 + ((input[4] & 15) << 10 | input[3] << 2 | (input[2] & 192) >> 6),
    width: 1 + ((input[2] & 63) << 8 | input[1])
  };
}
function calculateLossy(input) {
  return {
    height: readInt16LE(input, 8) & 16383,
    width: readInt16LE(input, 6) & 16383
  };
}
const WEBP = {
  validate(input) {
    const riffHeader = "RIFF" === toUTF8String(input, 0, 4);
    const webpHeader = "WEBP" === toUTF8String(input, 8, 12);
    const vp8Header = "VP8" === toUTF8String(input, 12, 15);
    return riffHeader && webpHeader && vp8Header;
  },
  calculate(input) {
    const chunkHeader = toUTF8String(input, 12, 16);
    input = input.slice(20, 30);
    if (chunkHeader === "VP8X") {
      const extendedHeader = input[0];
      const validStart = (extendedHeader & 192) === 0;
      const validEnd = (extendedHeader & 1) === 0;
      if (validStart && validEnd) {
        return calculateExtended(input);
      } else {
        throw new TypeError("Invalid WebP");
      }
    }
    if (chunkHeader === "VP8 " && input[0] !== 47) {
      return calculateLossy(input);
    }
    const signature = toHexString(input, 3, 6);
    if (chunkHeader === "VP8L" && signature !== "9d012a") {
      return calculateLossless(input);
    }
    throw new TypeError("Invalid WebP");
  }
};

const typeHandlers = /* @__PURE__ */ new Map([
  ["bmp", BMP],
  ["cur", CUR],
  ["dds", DDS],
  ["gif", GIF],
  ["heif", HEIF],
  ["icns", ICNS],
  ["ico", ICO],
  ["j2c", J2C],
  ["jp2", JP2],
  ["jpg", JPG],
  ["ktx", KTX],
  ["png", PNG],
  ["pnm", PNM],
  ["psd", PSD],
  ["svg", SVG],
  ["tga", TGA],
  ["tiff", TIFF],
  ["webp", WEBP]
]);
const types = Array.from(typeHandlers.keys());

const firstBytes = /* @__PURE__ */ new Map([
  [56, "psd"],
  [66, "bmp"],
  [68, "dds"],
  [71, "gif"],
  [73, "tiff"],
  [77, "tiff"],
  [82, "webp"],
  [105, "icns"],
  [137, "png"],
  [255, "jpg"]
]);
function detector(input) {
  const byte = input[0];
  const type = firstBytes.get(byte);
  if (type && typeHandlers.get(type).validate(input)) {
    return type;
  }
  return types.find((fileType) => typeHandlers.get(fileType).validate(input));
}

const globalOptions = {
  disabledTypes: []
};
function lookup(input) {
  const type = detector(input);
  if (typeof type !== "undefined") {
    if (globalOptions.disabledTypes.indexOf(type) > -1) {
      throw new TypeError("disabled file type: " + type);
    }
    const size = typeHandlers.get(type).calculate(input);
    if (size !== void 0) {
      size.type = size.type ?? type;
      return size;
    }
  }
  throw new TypeError("unsupported file type: " + type);
}

async function probe(url) {
  const response = await fetch(url);
  if (!response.body || !response.ok) {
    throw new Error("Failed to fetch image");
  }
  const reader = response.body.getReader();
  let done, value;
  let accumulatedChunks = new Uint8Array();
  while (!done) {
    const readResult = await reader.read();
    done = readResult.done;
    if (done)
      break;
    if (readResult.value) {
      value = readResult.value;
      let tmp = new Uint8Array(accumulatedChunks.length + value.length);
      tmp.set(accumulatedChunks, 0);
      tmp.set(value, accumulatedChunks.length);
      accumulatedChunks = tmp;
      try {
        const dimensions = lookup(accumulatedChunks);
        if (dimensions) {
          await reader.cancel();
          return dimensions;
        }
      } catch (error) {
      }
    }
  }
  throw new Error("Failed to parse the size");
}

async function getConfiguredImageService() {
  if (!globalThis?.astroAsset?.imageService) {
    const { default: service } = await import(
      // @ts-expect-error
      '../astro/assets-service_QdkxcCwb.mjs'
    ).then(n => n.k).catch((e) => {
      const error = new AstroError(InvalidImageService);
      error.cause = e;
      throw error;
    });
    if (!globalThis.astroAsset)
      globalThis.astroAsset = {};
    globalThis.astroAsset.imageService = service;
    return service;
  }
  return globalThis.astroAsset.imageService;
}
async function getImage$1(options, imageConfig) {
  if (!options || typeof options !== "object") {
    throw new AstroError({
      ...ExpectedImageOptions,
      message: ExpectedImageOptions.message(JSON.stringify(options))
    });
  }
  if (typeof options.src === "undefined") {
    throw new AstroError({
      ...ExpectedImage,
      message: ExpectedImage.message(
        options.src,
        "undefined",
        JSON.stringify(options)
      )
    });
  }
  const service = await getConfiguredImageService();
  const resolvedOptions = {
    ...options,
    src: await resolveSrc(options.src)
  };
  if (options.inferSize && isRemoteImage(resolvedOptions.src)) {
    try {
      const result = await probe(resolvedOptions.src);
      resolvedOptions.width ??= result.width;
      resolvedOptions.height ??= result.height;
      delete resolvedOptions.inferSize;
    } catch {
      throw new AstroError({
        ...FailedToFetchRemoteImageDimensions,
        message: FailedToFetchRemoteImageDimensions.message(resolvedOptions.src)
      });
    }
  }
  const originalFilePath = isESMImportedImage(resolvedOptions.src) ? resolvedOptions.src.fsPath : void 0;
  const clonedSrc = isESMImportedImage(resolvedOptions.src) ? (
    // @ts-expect-error - clone is a private, hidden prop
    resolvedOptions.src.clone ?? resolvedOptions.src
  ) : resolvedOptions.src;
  resolvedOptions.src = clonedSrc;
  const validatedOptions = service.validateOptions ? await service.validateOptions(resolvedOptions, imageConfig) : resolvedOptions;
  const srcSetTransforms = service.getSrcSet ? await service.getSrcSet(validatedOptions, imageConfig) : [];
  let imageURL = await service.getURL(validatedOptions, imageConfig);
  let srcSets = await Promise.all(
    srcSetTransforms.map(async (srcSet) => ({
      transform: srcSet.transform,
      url: await service.getURL(srcSet.transform, imageConfig),
      descriptor: srcSet.descriptor,
      attributes: srcSet.attributes
    }))
  );
  if (isLocalService(service) && globalThis.astroAsset.addStaticImage && !(isRemoteImage(validatedOptions.src) && imageURL === validatedOptions.src)) {
    const propsToHash = service.propertiesToHash ?? DEFAULT_HASH_PROPS;
    imageURL = globalThis.astroAsset.addStaticImage(
      validatedOptions,
      propsToHash,
      originalFilePath
    );
    srcSets = srcSetTransforms.map((srcSet) => ({
      transform: srcSet.transform,
      url: globalThis.astroAsset.addStaticImage(srcSet.transform, propsToHash, originalFilePath),
      descriptor: srcSet.descriptor,
      attributes: srcSet.attributes
    }));
  }
  return {
    rawOptions: resolvedOptions,
    options: validatedOptions,
    src: imageURL,
    srcSet: {
      values: srcSets,
      attribute: srcSets.map((srcSet) => `${srcSet.url} ${srcSet.descriptor}`).join(", ")
    },
    attributes: service.getHTMLAttributes !== void 0 ? await service.getHTMLAttributes(validatedOptions, imageConfig) : {}
  };
}

const $$Astro$5 = createAstro();
const $$Image = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$5, $$props, $$slots);
  Astro2.self = $$Image;
  const props = Astro2.props;
  if (props.alt === void 0 || props.alt === null) {
    throw new AstroError(ImageMissingAlt);
  }
  if (typeof props.width === "string") {
    props.width = parseInt(props.width);
  }
  if (typeof props.height === "string") {
    props.height = parseInt(props.height);
  }
  const image = await getImage(props);
  const additionalAttributes = {};
  if (image.srcSet.values.length > 0) {
    additionalAttributes.srcset = image.srcSet.attribute;
  }
  return renderTemplate`${maybeRenderHead()}<img${addAttribute(image.src, "src")}${spreadAttributes(additionalAttributes)}${spreadAttributes(image.attributes)}>`;
}, "C:/Users/frava/OneDrive/Escritorio/proyectos/gymlandV2/node_modules/astro/components/Image.astro", void 0);

const $$Astro$4 = createAstro();
const $$Picture = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$4, $$props, $$slots);
  Astro2.self = $$Picture;
  const defaultFormats = ["webp"];
  const defaultFallbackFormat = "png";
  const specialFormatsFallback = ["gif", "svg", "jpg", "jpeg"];
  const { formats = defaultFormats, pictureAttributes = {}, fallbackFormat, ...props } = Astro2.props;
  if (props.alt === void 0 || props.alt === null) {
    throw new AstroError(ImageMissingAlt);
  }
  const originalSrc = await resolveSrc(props.src);
  const optimizedImages = await Promise.all(
    formats.map(
      async (format) => await getImage({
        ...props,
        src: originalSrc,
        format,
        widths: props.widths,
        densities: props.densities
      })
    )
  );
  let resultFallbackFormat = fallbackFormat ?? defaultFallbackFormat;
  if (!fallbackFormat && isESMImportedImage(originalSrc) && specialFormatsFallback.includes(originalSrc.format)) {
    resultFallbackFormat = originalSrc.format;
  }
  const fallbackImage = await getImage({
    ...props,
    format: resultFallbackFormat,
    widths: props.widths,
    densities: props.densities
  });
  const imgAdditionalAttributes = {};
  const sourceAdditionalAttributes = {};
  if (props.sizes) {
    sourceAdditionalAttributes.sizes = props.sizes;
  }
  if (fallbackImage.srcSet.values.length > 0) {
    imgAdditionalAttributes.srcset = fallbackImage.srcSet.attribute;
  }
  return renderTemplate`${maybeRenderHead()}<picture${spreadAttributes(pictureAttributes)}> ${Object.entries(optimizedImages).map(([_, image]) => {
    const srcsetAttribute = props.densities || !props.densities && !props.widths ? `${image.src}${image.srcSet.values.length > 0 ? ", " + image.srcSet.attribute : ""}` : image.srcSet.attribute;
    return renderTemplate`<source${addAttribute(srcsetAttribute, "srcset")}${addAttribute("image/" + image.options.format, "type")}${spreadAttributes(sourceAdditionalAttributes)}>`;
  })} <img${addAttribute(fallbackImage.src, "src")}${spreadAttributes(imgAdditionalAttributes)}${spreadAttributes(fallbackImage.attributes)}> </picture>`;
}, "C:/Users/frava/OneDrive/Escritorio/proyectos/gymlandV2/node_modules/astro/components/Picture.astro", void 0);

const imageConfig = {"service":{"entrypoint":"astro/assets/services/sharp","config":{}},"domains":[],"remotePatterns":[]};
					const getImage = async (options) => await getImage$1(options, imageConfig);

const logo = new Proxy({"src":"/_astro/logo.DSs0V6y6.jpg","width":533,"height":500,"format":"jpg"}, {
						get(target, name, receiver) {
							if (name === 'clone') {
								return structuredClone(target);
							}
							if (name === 'fsPath') {
								return "C:/Users/frava/OneDrive/Escritorio/proyectos/gymlandV2/src/images/logo.jpg";
							}
							
							return target[name];
						}
					});

function Menu() {
  const [hide, setHide] = useState(true);
  const handleHide = () => {
    setHide(!hide);
  };
  return /* @__PURE__ */ jsx(Fragment, { children: hide ? /* @__PURE__ */ jsx(FaBars, { className: "icon", onClick: handleHide }) : /* @__PURE__ */ jsx(SideMenu, { show: hide, handleHide }) });
}
function SideMenu({ handleHide, show }) {
  return /* @__PURE__ */ jsxs("div", { className: show.toString(), children: [
    /* @__PURE__ */ jsxs("div", { className: "header", children: [
      /* @__PURE__ */ jsx("h2", { className: " ", children: "Gymland" }),
      /* @__PURE__ */ jsx(IoCloseSharp, { onClick: handleHide })
    ] }),
    /* @__PURE__ */ jsxs("ul", { className: "links-container", children: [
      /* @__PURE__ */ jsx("a", { className: "link", href: "/", onClick: handleHide, children: "Inicio" }),
      /* @__PURE__ */ jsx("a", { className: "link", href: "/sproducts", onClick: handleHide, children: "Favoritos" }),
      /* @__PURE__ */ jsx("a", { className: "link", href: "/products", onClick: handleHide, children: "Gymshark" }),
      /* @__PURE__ */ jsx("a", { className: "link", href: "/wbest", onClick: handleHide, children: "Wommen's Best" })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "icons-container", children: [
      /* @__PURE__ */ jsx("a", { href: "https://www.instagram.com/gymlandhn/", target: "_blank", children: /* @__PURE__ */ jsx(BsInstagram, { className: "icon" }) }),
      /* @__PURE__ */ jsx("a", { href: "https://www.facebook.com/gymlandhn?locale=es_LA", target: "_blank", children: /* @__PURE__ */ jsx(FaFacebook, { className: "icon" }) })
    ] })
  ] });
}

const $$Navbar = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${maybeRenderHead()}<nav class="navbar" data-astro-cid-c2t4lvt4> <a href="/" data-astro-cid-c2t4lvt4> ${renderComponent($$result, "Image", $$Image, { "class": "logo", "src": logo, "alt": "GYMLAND LOGO", "data-astro-cid-c2t4lvt4": true })} </a> <div class="links-container" data-astro-cid-c2t4lvt4> <a class="link" href="/sproducts" data-astro-cid-c2t4lvt4>Favoritos</a> <a class="link" href="/products" data-astro-cid-c2t4lvt4>Gymshark</a> <a class="link" href="/wbest" data-astro-cid-c2t4lvt4>Women'sBest</a> ${renderComponent($$result, "Menu", Menu, { "client:load": true, "client:component-hydration": "load", "client:component-path": "C:/Users/frava/OneDrive/Escritorio/proyectos/gymlandV2/src/components/reactComponents/Menu", "client:component-export": "default", "data-astro-cid-c2t4lvt4": true })} </div> </nav> `;
}, "C:/Users/frava/OneDrive/Escritorio/proyectos/gymlandV2/src/components/astroComponents/Navbar.astro", void 0);

const $$Astro$3 = createAstro();
const $$Layout = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$3, $$props, $$slots);
  Astro2.self = $$Layout;
  const { title } = Astro2.props;
  return renderTemplate`<html lang="en"> <head><meta charset="UTF-8"><meta name="description" content="Astro description"><meta name="viewport" content="width=device-width"><link rel="icon" type="image/svg+xml" href="/favicon.svg"><meta name="generator"${addAttribute(Astro2.generator, "content")}><title>${title}</title>${renderHead()}</head> <body> ${renderComponent($$result, "Navbar", $$Navbar, {})} ${renderSlot($$result, $$slots["default"])} ${renderComponent($$result, "Analytics", Analytics, {})} </body></html>`;
}, "C:/Users/frava/OneDrive/Escritorio/proyectos/gymlandV2/src/layouts/Layout.astro", void 0);

const gymsharkProducts = [
    {
        id: 1,
        name: 'GFX-Crew-Socks-3pk',
        productName: 'GFX Crew Socks',
        image1: 'https://github.com/Jose-Vargas-Guerrero/gymlandImages/blob/main/gymsharkImages/3pk1.JPG?raw=true',
        image2: 'https://github.com/Jose-Vargas-Guerrero/gymlandImages/blob/main/gymsharkImages/3pk2.JPG?raw=true',
        image3: 'https://github.com/Jose-Vargas-Guerrero/gymlandImages/blob/main/gymsharkImages/3pk3.JPG?raw=true',
        image4: 'https://github.com/Jose-Vargas-Guerrero/gymlandImages/blob/main/gymsharkImages/3pk4.JPG?raw=true',
        color: 'White',
        category: 'Body fit',
        size: 'S',
        price: 270,
        type: ' c/u ',
    },
    {
        id: 111,
        name: 'Crew-Socks-7PK',
        productName: 'Crew socks',
        image1: 'https://cdn.shopify.com/s/files/1/0156/6146/files/GFXCrewSocks7PKGSWhiteI3A2V-WB57-0081-4_1920x.jpg?v=1695813528',
        image2: 'https://cdn.shopify.com/s/files/1/0156/6146/files/GFXCrewSocks7PKGSWhiteI3A2V-WB57-0151_828x.jpg?v=1695813529',
        color: 'White',
        category: 'Body fit',
        size: 'M',
        price: 320,
        type: ' c/u '
    },
    {
        id: 2,
        name: 'Crew-Socks-5pk',
        productName: 'Crew socks',
        image1: 'https://github.com/Jose-Vargas-Guerrero/gymlandImages/blob/main/gymsharkImages/5pk1.JPG?raw=true',
        image2: 'https://github.com/Jose-Vargas-Guerrero/gymlandImages/blob/main/gymsharkImages/5pk2.JPG?raw=true',
        color: 'Plum Pink/Deep Teal/Citrus Green/Capri Blue/Grape Purple',
        category: 'Body fit',
        size: 'S',
        price: 250,
        type: ' c/u '

    },
    {
        id: 222,
        name: 'calcetines-gymshark',
        productName: 'Calcetines gymshark',
        image1: 'https://github.com/Jose-Vargas-Guerrero/gymlandImages/blob/main/gymsharkImages/calcetinesgymshark3.jpeg?raw=true',
        image2: 'https://github.com/Jose-Vargas-Guerrero/gymlandImages/blob/main/gymsharkImages/calcetinesgymshark4.jpeg?raw=true',
        image3: 'https://github.com/Jose-Vargas-Guerrero/gymlandImages/blob/main/gymsharkImages/calcetinesgymshark2.jpeg?raw=true',
        image4: 'https://github.com/Jose-Vargas-Guerrero/gymlandImages/blob/main/gymsharkImages/calcetinesgymshark1.jpeg?raw=true',
        color:  'White',
        category: 'Body fit',
        size: 'S | M | L',
        price: 250,
        type: ' c/u ',
        stock: '',

    },
    {
        id: 434,
        name: 'Calcetines-GYMSHARK-Pastel',
        productName: 'Calcetines GYMSHARK',
        image1: 'https://github.com/Jose-Vargas-Guerrero/gymlandImages/blob/main/shein/CalcetinesGYMSHARKPastel2.JPG?raw=true',
        image2: 'https://github.com/Jose-Vargas-Guerrero/gymlandImages/blob/main/shein/CalcetinesGYMSHARKPastel1.JPG?raw=true',
        color:  'Blanco| Rosa | Gris',
        category: 'Body fit',
        size: 'S M L',
        price: 390,
        type: '1100 Pack completo',

    },
    {
        id: 3,
        name: 'Adapt-Animal-Seamless-Crop-Tank',
        productName: 'Adapt Animal Seamless Crop Tank',
        image1: 'https://github.com/Jose-Vargas-Guerrero/gymlandImages/blob/main/gymsharkImages/cherrybrown1.JPG?raw=true',
        image2: 'https://github.com/Jose-Vargas-Guerrero/gymlandImages/blob/main/gymsharkImages/cherrybrown2.JPG?raw=true',
        image3: 'https://github.com/Jose-Vargas-Guerrero/gymlandImages/blob/main/gymsharkImages/cherrybrown3.JPG?raw=true',
        image4: 'https://github.com/Jose-Vargas-Guerrero/gymlandImages/blob/main/gymsharkImages/cherrybrown4.JPG?raw=true',
        image5: 'https://github.com/Jose-Vargas-Guerrero/gymlandImages/blob/main/gymsharkImages/cherrybrown5.JPG?raw=true',
        color: 'Reef | Cherry Brown',
        category: 'Body fit',
        size: 'S',
        price: 1190
    },
    {
        id: 4,
        name: 'Sport-Bra',
        productName: 'Crossover Sport Bra',
        image1: 'https://github.com/Jose-Vargas-Guerrero/gymlandImages/blob/main/gymsharkImages/greenbra1.JPG?raw=true',
        image2: 'https://github.com/Jose-Vargas-Guerrero/gymlandImages/blob/main/gymsharkImages/greenbra2.JPG?raw=true',
        image3: 'https://github.com/Jose-Vargas-Guerrero/gymlandImages/blob/main/gymsharkImages/greenbra3.JPG?raw=true',
        image4: 'https://github.com/Jose-Vargas-Guerrero/gymlandImages/blob/main/gymsharkImages/greenbra4.JPG?raw=true',
        image5: 'https://github.com/Jose-Vargas-Guerrero/gymlandImages/blob/main/gymsharkImages/greenbra5.JPG?raw=true',
        image6: 'https://github.com/Jose-Vargas-Guerrero/gymlandImages/blob/main/gymsharkImages/greenbra6.JPG?raw=true',
        color: 'Desert Sage Green',
        category: 'Body fit',
        size: 'S',
        price: 990
    },
    {
        id: 5,
        name: 'Adapt-Camo-Seamless-Sports-Bra',
        productName: 'Adapt Camo Seamless Sports Bra',
        image1: 'https://github.com/Jose-Vargas-Guerrero/gymlandImages/blob/main/gymsharkImages/greybra1.JPG?raw=true',
        image2: 'https://github.com/Jose-Vargas-Guerrero/gymlandImages/blob/main/gymsharkImages/greybra2.JPG?raw=true',
        image3: 'https://github.com/Jose-Vargas-Guerrero/gymlandImages/blob/main/gymsharkImages/greybra3.JPG?raw=true',
        image4: 'https://github.com/Jose-Vargas-Guerrero/gymlandImages/blob/main/gymsharkImages/greybra4.JPG?raw=true',
        image5: 'https://github.com/Jose-Vargas-Guerrero/gymlandImages/blob/main/gymsharkImages/greybra5.JPG?raw=true',
        image6: 'https://github.com/Jose-Vargas-Guerrero/gymlandImages/blob/main/gymsharkImages/greybra6.JPG?raw=true',
        color: 'Pebble Grey/Soul Brown',
        category: 'Body fit',
        size: 'M',
        price: 1090,
    },
    {
        id: 6,
        name: 'Adapt-Camo-Seamless-Lace-Up-Back-Top',
        productName: 'Adapt Camo Seamless Lace Up Back Top',
        image1: 'https://github.com/Jose-Vargas-Guerrero/gymlandImages/blob/main/gymsharkImages/redback1.JPG?raw=true',
        image2: 'https://github.com/Jose-Vargas-Guerrero/gymlandImages/blob/main/gymsharkImages/redback2.JPG?raw=true',
        image3: 'https://github.com/Jose-Vargas-Guerrero/gymlandImages/blob/main/gymsharkImages/redback3.JPG?raw=true',
        image4: 'https://github.com/Jose-Vargas-Guerrero/gymlandImages/blob/main/gymsharkImages/redback4.JPG?raw=true',
        image5: 'https://github.com/Jose-Vargas-Guerrero/gymlandImages/blob/main/gymsharkImages/redback5.JPG?raw=true',
        image6: 'https://github.com/Jose-Vargas-Guerrero/gymlandImages/blob/main/gymsharkImages/redback6.JPG?raw=true',
        color: 'Storm Red/Cherry Brown',
        category: 'Body fit',
        size: 'S',
        price: 1190,
    },
    {
        id: 7,
        name: 'Crossover-Sport-Bra',
        productName: 'Crossover Sport Bra',
        image1: 'https://github.com/Jose-Vargas-Guerrero/gymlandImages/blob/main/gymsharkImages/lavenderbra1.JPG?raw=true',
        image2: 'https://github.com/Jose-Vargas-Guerrero/gymlandImages/blob/main/gymsharkImages/lavenderbra2.JPG?raw=true',
        image3: 'https://github.com/Jose-Vargas-Guerrero/gymlandImages/blob/main/gymsharkImages/lavenderbra3.JPG?raw=true',
        image4: 'https://github.com/Jose-Vargas-Guerrero/gymlandImages/blob/main/gymsharkImages/lavenderbra4.JPG?raw=true',
        image5: 'https://github.com/Jose-Vargas-Guerrero/gymlandImages/blob/main/gymsharkImages/lavenderbra5.JPG?raw=true',
        image6: 'https://github.com/Jose-Vargas-Guerrero/gymlandImages/blob/main/gymsharkImages/lavenderbra6.JPG?raw=true',
        color: 'Slate Lavender',
        category: 'Body fit',
        size: 'M | S',
        price: 990
    },
    {
        id: 8,
        name: 'Elevate-Longline-Sports-Bra',
        productName: 'Elevate Longline Sports Bra',
        image1: 'https://github.com/Jose-Vargas-Guerrero/gymlandImages/blob/main/gymsharkImages/olivebra1.JPG?raw=true',
        image2: 'https://github.com/Jose-Vargas-Guerrero/gymlandImages/blob/main/gymsharkImages/olivebra2.JPG?raw=true',
        image3: 'https://github.com/Jose-Vargas-Guerrero/gymlandImages/blob/main/gymsharkImages/olivebra3.JPG?raw=true',
        image4: 'https://github.com/Jose-Vargas-Guerrero/gymlandImages/blob/main/gymsharkImages/olivebra4.JPG?raw=true',
        image5: 'https://github.com/Jose-Vargas-Guerrero/gymlandImages/blob/main/gymsharkImages/olivebra5.JPG?raw=true',
        image6: 'https://github.com/Jose-Vargas-Guerrero/gymlandImages/blob/main/gymsharkImages/olivebra6.JPG?raw=true',
        color: 'Moss Olive',
        category: 'Body fit',
        size: 'S | M',
        price: 1090
    },
    {
        id: 9,
        name: 'Legacy-Ruched-Tights-Shorts',
        productName: 'Legacy Ruched Tights Shorts',
        image1: 'https://github.com/Jose-Vargas-Guerrero/gymlandImages/blob/main/gymsharkImages/bluelegacy1.JPG?raw=true',
        image2: 'https://github.com/Jose-Vargas-Guerrero/gymlandImages/blob/main/gymsharkImages/bluelegacy2.JPG?raw=true',
        image3: 'https://github.com/Jose-Vargas-Guerrero/gymlandImages/blob/main/gymsharkImages/bluelegacy3.JPG?raw=true',
        image4: 'https://github.com/Jose-Vargas-Guerrero/gymlandImages/blob/main/gymsharkImages/bluelegacy4.JPG?raw=true',
        image5: 'https://github.com/Jose-Vargas-Guerrero/gymlandImages/blob/main/gymsharkImages/bluelegacy5.JPG?raw=true',
        image6: 'https://github.com/Jose-Vargas-Guerrero/gymlandImages/blob/main/gymsharkImages/bluelegacy6.JPG?raw=true',
        color: 'Lakgeside Blue',
        category: 'Body fit',
        size: 'S',
        price: 1190
    },
    {
        id: 99,
        name: 'Legacy-Shorts-Washed-Green',
        productName: 'Legacy Shorts',
        image1: 'https://github.com/Jose-Vargas-Guerrero/gymlandImages/blob/main/gymsharkImages/legacyshort1.jpg?raw=true',
        image2: 'https://github.com/Jose-Vargas-Guerrero/gymlandImages/blob/main/gymsharkImages/legacyshort2.jpg?raw=true',
        image3: 'https://github.com/Jose-Vargas-Guerrero/gymlandImages/blob/main/gymsharkImages/legacyshort3.jpg?raw=true',
        image4: 'https://github.com/Jose-Vargas-Guerrero/gymlandImages/blob/main/gymsharkImages/legacyshort4.jpg?raw=true',
        image5: 'https://github.com/Jose-Vargas-Guerrero/gymlandImages/blob/main/gymsharkImages/legacyshort5.jpg?raw=true',
        color: 'Washed Green',
        category: 'Body fit',
        size: 'M',
        price: 1190,
        stock: 'Agotado',
    },
    {
        id: 10,
        name: 'Pocket-Shorts',
        productName: 'Pocket Shorts',
        image1: 'https://github.com/Jose-Vargas-Guerrero/gymlandImages/blob/main/gymsharkImages/pocketblue2.JPG?raw=true',
        image2: 'https://github.com/Jose-Vargas-Guerrero/gymlandImages/blob/main/gymsharkImages/pocketblue3.JPG?raw=true',
        image3: 'https://github.com/Jose-Vargas-Guerrero/gymlandImages/blob/main/gymsharkImages/pocketblue4.JPG?raw=true',
        image4: 'https://github.com/Jose-Vargas-Guerrero/gymlandImages/blob/main/gymsharkImages/pocketblue5.JPG?raw=true',
        image5: 'https://github.com/Jose-Vargas-Guerrero/gymlandImages/blob/main/gymsharkImages/pocketblue6.JPG?raw=true',
        image6: 'https://github.com/Jose-Vargas-Guerrero/gymlandImages/blob/main/gymsharkImages/pocketblue1.JPG?raw=true',
        color: 'Denim Blue',
        category: 'Body fit',
        size: 'M',
        price: 1090
    },
    {
        name: 'Studio-Shorts',
        productName: 'Studio Shorts',
        image1: 'https://cdn.shopify.com/s/files/1/1367/5207/products/StudioWShortsBlack-B1A9N-BBBB.A_1920x.jpg?v=1656931461',
        image2: 'https://cdn.shopify.com/s/files/1/1367/5207/products/StudioWShortsBlack-B1A9N-BBBB.D2_384x.jpg?v=1656931461',
        image3: 'https://cdn.shopify.com/s/files/1/1367/5207/products/StudioWShortsBlack-B1A9N-BBBB.D3_384x.jpg?v=1656931461',
        color: 'Black',
        category: 'Body fit',
        size: 'S',
        price: 990
    },
    {
        id: 12,
        name: 'Gs-Power-Original-Leggings',
        productName: 'Gs Power Original Leggings',
        image1: 'https://github.com/Jose-Vargas-Guerrero/gymlandImages/blob/main/gymsharkImages/powerblue1.JPG?raw=true',
        image2: 'https://github.com/Jose-Vargas-Guerrero/gymlandImages/blob/main/gymsharkImages/powerblue2.JPG?raw=true',
        image3: 'https://github.com/Jose-Vargas-Guerrero/gymlandImages/blob/main/gymsharkImages/powerblue3.JPG?raw=true',
        image4: 'https://github.com/Jose-Vargas-Guerrero/gymlandImages/blob/main/gymsharkImages/powerblue4.JPG?raw=true',
        image5: 'https://github.com/Jose-Vargas-Guerrero/gymlandImages/blob/main/gymsharkImages/powerblue5.JPG?raw=true',
        image6: 'https://github.com/Jose-Vargas-Guerrero/gymlandImages/blob/main/gymsharkImages/powerblue6.JPG?raw=true',
        color: 'Coastal Blue',
        category: 'Body fit',
        size: 'S',
        price: 1390
    },
    {
        id: 13,
        name: 'Adapt-Animal-Seamless-Leggings',
        productName: 'Adapt Animal Seamless Leggins',
        image1: 'https://github.com/Jose-Vargas-Guerrero/gymlandImages/blob/main/gymsharkImages/legingblack1.JPG?raw=true',
        image2: 'https://github.com/Jose-Vargas-Guerrero/gymlandImages/blob/main/gymsharkImages/legingblack2.JPG?raw=true',
        image3: 'https://github.com/Jose-Vargas-Guerrero/gymlandImages/blob/main/gymsharkImages/legingblack3.JPG?raw=true',
        image4: 'https://github.com/Jose-Vargas-Guerrero/gymlandImages/blob/main/gymsharkImages/legingblack4.JPG?raw=true',
        image5: 'https://github.com/Jose-Vargas-Guerrero/gymlandImages/blob/main/gymsharkImages/legingblack6.JPG?raw=true',
        image6: 'https://github.com/Jose-Vargas-Guerrero/gymlandImages/blob/main/gymsharkImages/legingblack7.JPG?raw=true',
        color: 'Reef | Black',
        category: 'Body fit',
        size: 'S',
        price: 1490,
        stock: 'Agotado',
    },
    {
        id: 14,
        name: 'Flex-High-Waisted-Leggings',
        productName: 'Flex High Waisted Leggings',
        image1: 'https://cdn.shopify.com/s/files/1/1367/5207/products/FlexHwLeggingsEarlBlueMarlB1A2Q.A_ZH_ZH_d9ffee9e-5a61-4222-8c99-5007c686e0c9_1920x.jpg?v=1652186862',
        image2: 'https://cdn.shopify.com/s/files/1/1367/5207/products/FlexHwLeggingsEarlBlueMarlB1A2Q.D2_ZH_ZH_8b57f430-3480-4a82-9c91-1d7008cf9a8c_384x.jpg?v=1652186862',
        image3: 'https://cdn.shopify.com/s/files/1/1367/5207/products/FlexHwLeggingsEarlBlueMarlB1A2Q.D3_ZH_ZH_2ee97bd0-00af-4d98-a8bd-49c446c7130e_384x.jpg?v=1652186862',
        color: 'Earl Blue Marl',
        category: 'Body fit',
        size: 'S',
        price: 1390,
        stock: 'Agotado',
    },
    {
        id: 15,
        name: 'Legacy-Sports-Bra',
        productName: 'Legacy Sports Bra',
        image1: 'https://github.com/Jose-Vargas-Guerrero/gymlandImages/blob/main/gymsharkImages/hoyabra1.JPG?raw=true',
        image2: 'https://github.com/Jose-Vargas-Guerrero/gymlandImages/blob/main/gymsharkImages/hoyabra2.JPG?raw=true',
        image3: 'https://github.com/Jose-Vargas-Guerrero/gymlandImages/blob/main/gymsharkImages/hoyabra3.JPG?raw=true',
        image4: 'https://github.com/Jose-Vargas-Guerrero/gymlandImages/blob/main/gymsharkImages/hoyabra4.JPG?raw=true',
        image5: 'https://github.com/Jose-Vargas-Guerrero/gymlandImages/blob/main/gymsharkImages/hoyabra5.JPG?raw=true',
        image6: 'https://github.com/Jose-Vargas-Guerrero/gymlandImages/blob/main/gymsharkImages/hoyabra6.JPG?raw=true',
        color: 'Hoya Green',
        category: 'Body fit',
        size: 'S',
        price: 990
    },
    {
        id: 16,
        name: 'Vital-Seamless-2.0-High-Neck-Midi_top',
        productName: 'Vital Seamless 2.0 High Neck Midi top',
        image1: 'https://github.com/Jose-Vargas-Guerrero/gymlandImages/blob/main/gymsharkImages/midtopblack1.JPG?raw=true',
        image2: 'https://github.com/Jose-Vargas-Guerrero/gymlandImages/blob/main/gymsharkImages/midtopblack2.JPG?raw=true',
        image3: 'https://github.com/Jose-Vargas-Guerrero/gymlandImages/blob/main/gymsharkImages/midtopblack3.JPG?raw=true',
        color: 'Black Marl',
        category: 'Body fit',
        size: 'M',
        price: 1290
    },
    {
        id: 17,
        name: 'Vital-Seamless-2.0-High-Neck-Midi-top',
        productName: 'Vital Seamless 2.0 High Neck Midi top',
        image1: 'https://github.com/Jose-Vargas-Guerrero/gymlandImages/blob/main/gymsharkImages/midtopblue1.JPG?raw=true',
        image2: 'https://github.com/Jose-Vargas-Guerrero/gymlandImages/blob/main/gymsharkImages/midtopblue2.JPG?raw=true',
        image3: 'https://github.com/Jose-Vargas-Guerrero/gymlandImages/blob/main/gymsharkImages/midtopblue3.JPG?raw=true',
        image4: 'https://github.com/Jose-Vargas-Guerrero/gymlandImages/blob/main/gymsharkImages/midtopblue4.JPG?raw=true',
        image5: 'https://github.com/Jose-Vargas-Guerrero/gymlandImages/blob/main/gymsharkImages/midtopblue5.JPG?raw=true',
        image6: 'https://github.com/Jose-Vargas-Guerrero/gymlandImages/blob/main/gymsharkImages/midtopblue6.JPG?raw=true',
        color: 'Stellar Blue Marl',
        category: 'Body fit',
        size: 'S',
        price: 1190
    },
    {
        id: 18,
        name: 'Cycling-Shorts-Panther',
        productName: 'Cycling Shorts',
        image1: 'https://github.com/Jose-Vargas-Guerrero/gymlandImages/blob/main/gymsharkImages/panteraNegra1.jpg?raw=true',
        image2: 'https://github.com/Jose-Vargas-Guerrero/gymlandImages/blob/main/gymsharkImages/panteraNegra2.jpg?raw=true',
        image3: 'https://github.com/Jose-Vargas-Guerrero/gymlandImages/blob/main/gymsharkImages/panteraNegra3.jpg?raw=true',
        color: 'Black',
        category: 'Body fit',
        size: 'S',
        price: 990,
    },
];

const $$Footer = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${maybeRenderHead()}<div class="footer" data-astro-cid-76a7ocz5> <p data-astro-cid-76a7ocz5>contact</p> <a class="link" href="https://www.instagram.com/gymlandhn/" target="_blank" data-astro-cid-76a7ocz5> ${renderComponent($$result, "FaInstagram", FaInstagram, { "client:load": true, "client:component-hydration": "load", "client:component-path": "react-icons/fa", "client:component-export": "FaInstagram", "data-astro-cid-76a7ocz5": true })} </a> <a class="link" href="https://www.facebook.com/gymlandhn?locale=es_LA" target="_blank" data-astro-cid-76a7ocz5> ${renderComponent($$result, "FaFacebook", FaFacebook, { "client:load": true, "client:component-hydration": "load", "client:component-path": "react-icons/fa", "client:component-export": "FaFacebook", "data-astro-cid-76a7ocz5": true })} </a> <a class="link" href="https://wa.me/+50488704030" target="_blank" data-astro-cid-76a7ocz5> ${renderComponent($$result, "FaWhatsapp", FaWhatsapp, { "client:load": true, "client:component-hydration": "load", "client:component-path": "react-icons/fa", "client:component-export": "FaWhatsapp", "data-astro-cid-76a7ocz5": true })} </a> <a class="link" href="mailto:gymlandhn@gmail.com" target="_blank" data-astro-cid-76a7ocz5> ${renderComponent($$result, "IoMdMail", IoMdMail, { "client:load": true, "client:component-hydration": "load", "client:component-path": "react-icons/io", "client:component-export": "IoMdMail", "data-astro-cid-76a7ocz5": true })} </a> <a class="link" class="link-mail" href="mailto:josevgdesarrollador@gmail.com.com" target="_blank" data-astro-cid-76a7ocz5> <p class="link-mail" data-astro-cid-76a7ocz5>josevgdesarrollador@gmail.com</p> </a> </div> `;
}, "C:/Users/frava/OneDrive/Escritorio/proyectos/gymlandV2/src/components/astroComponents/Footer.astro", void 0);

const $$Astro$2 = createAstro();
async function getStaticPaths$2() {
  const info = gymsharkProducts;
  return info.map((p) => {
    return {
      params: { name: p.name },
      props: { p }
    };
  });
}
const $$name$2 = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$2, $$props, $$slots);
  Astro2.self = $$name$2;
  const { name } = Astro2.params;
  const { p } = Astro2.props;
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": name, "data-astro-cid-z6knrcby": true }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="gallery-container" data-astro-cid-z6knrcby> <div class="gallery-images" data-astro-cid-z6knrcby> <div class="gallery-inner" data-astro-cid-z6knrcby> <img loading="lazy" class="gallery-image"${addAttribute(p.image1, "src")} data-astro-cid-z6knrcby> <img loading="lazy" class="gallery-image"${addAttribute(p.image2, "src")} data-astro-cid-z6knrcby> <img loading="lazy" class="gallery-image"${addAttribute(p.image3, "src")} data-astro-cid-z6knrcby> <img loading="lazy" class="gallery-image"${addAttribute(p.image4, "src")} data-astro-cid-z6knrcby> <img loading="lazy" class="gallery-image"${addAttribute(p.image5, "src")} data-astro-cid-z6knrcby> <img loading="lazy" class="gallery-image"${addAttribute(p.image6, "src")} data-astro-cid-z6knrcby> </div> </div> <div class="gallery-info" data-astro-cid-z6knrcby> <div class="box" data-astro-cid-z6knrcby> <h2 data-astro-cid-z6knrcby>${p.productName}</h2> <h2 data-astro-cid-z6knrcby>L.${p.price}</h2> ${p.sales && renderTemplate`<strong class="price sales" data-astro-cid-z6knrcby>Oferta: ${p.packet} L. ${p.sales}</strong>`} <p data-astro-cid-z6knrcby>${p.color}</p> <p data-astro-cid-z6knrcby>${p.category}</p> <p class="space" data-astro-cid-z6knrcby>Size: ${p.size}</p> <a class="wlink"${addAttribute(`https://api.whatsapp.com/send?phone=+50488704030&text=\xA1Hola! en que podemos ayudarte?`, "href")} target="_blank" data-astro-cid-z6knrcby>
contactar</a> </div> </div> </div> ${renderComponent($$result2, "Footer", $$Footer, { "data-astro-cid-z6knrcby": true })} ` })} `;
}, "C:/Users/frava/OneDrive/Escritorio/proyectos/gymlandV2/src/pages/products/[name].astro", void 0);

const $$file$2 = "C:/Users/frava/OneDrive/Escritorio/proyectos/gymlandV2/src/pages/products/[name].astro";
const $$url$2 = "/products/[name]";

const _name_$2 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$name$2,
  file: $$file$2,
  getStaticPaths: getStaticPaths$2,
  url: $$url$2
}, Symbol.toStringTag, { value: 'Module' }));

const wproducts$1 = [
    {
        id: 1,
        name: 'Falda-Deportiva-Basic-tenis',
        productName: 'Falda Deportiva Básica De Tenis',
        image1: 'https://github.com/Jose-Vargas-Guerrero/gymlandImages/blob/main/shein/faldatenis1.JPG?raw=true',
        image2: 'https://github.com/Jose-Vargas-Guerrero/gymlandImages/blob/main/shein/faldatenis2.jpg?raw=true',
        image3: 'https://github.com/Jose-Vargas-Guerrero/gymlandImages/blob/main/shein/faldatenis3.jpg?raw=true',
        image4: 'https://github.com/Jose-Vargas-Guerrero/gymlandImages/blob/main/shein/faldatenis4.jpg?raw=true',
        color: 'Negro',
        category: 'Body fit',
        size: 'S | M',
        price: 490,
        stock: 'Agotado',
    },
    {
        id: 2,
        name: 'Gym-Sport-Bra',
        productName: 'Gym Sport Bra',
        image1: 'https://github.com/Jose-Vargas-Guerrero/gymlandImages/blob/main/shein/gymbra1.JPG?raw=true',
        image2: 'https://github.com/Jose-Vargas-Guerrero/gymlandImages/blob/main/shein/gymbra3.JPG?raw=true',
        image3: 'https://github.com/Jose-Vargas-Guerrero/gymlandImages/blob/main/shein/gymbra2.JPG?raw=true',
        image4: 'https://github.com/Jose-Vargas-Guerrero/gymlandImages/blob/main/shein/gymbra4.JPG?raw=true',
        image5: 'https://github.com/Jose-Vargas-Guerrero/gymlandImages/blob/main/shein/gymbra5.JPG?raw=true',
        color: 'Negro, Beige Blanco',
        category: 'Body fit',
        size: 'S',
        price: 360,
        stock: 'Agotado',
    },
    {
        id: 3,
        name: 'Gym-Shorts',
        productName: 'Gym shorts',
        image1: 'https://github.com/Jose-Vargas-Guerrero/gymlandImages/blob/main/shein/gymshort1.jpg?raw=true',
        image2: 'https://github.com/Jose-Vargas-Guerrero/gymlandImages/blob/main/shein/gymshort2.jpg?raw=true',
        image3: 'https://github.com/Jose-Vargas-Guerrero/gymlandImages/blob/main/shein/gymshort3.jpg?raw=true',
        image4: 'https://github.com/Jose-Vargas-Guerrero/gymlandImages/blob/main/shein/gymshort4.JPG?raw=true',
        color: 'Negro, Morado Claro, Morado Oscuro',
        category: 'Body fit',
        size: 'S | M',
        price: 395,
        stock: 'Negro Agotado',
    },
    {
        id: 4,
        name: 'Gym-Shorts-Highs',
        productName: 'Gym Shorts Highs',
        image1: 'https://github.com/Jose-Vargas-Guerrero/gymlandImages/blob/main/shein/shorthigh1.JPG?raw=true',
        image2: 'https://github.com/Jose-Vargas-Guerrero/gymlandImages/blob/main/shein/shorthigh2.JPG?raw=true',
        color: 'Negro, Gris, Beige, Celeste Claro',
        category: 'Body fit',
        size: 'S',
        price: 395,
        stock: 'Negro Agotado'
    },
    {
        id: 5,
        name: 'Biker-Shorts',
        productName: 'Biker Shorts',
        image1: 'https://github.com/Jose-Vargas-Guerrero/gymlandImages/blob/main/shein/bykershort1.JPG?raw=true',
        image2: 'https://github.com/Jose-Vargas-Guerrero/gymlandImages/blob/main/shein/bykershort2.jpg?raw=true',
        image3: 'https://github.com/Jose-Vargas-Guerrero/gymlandImages/blob/main/shein/bykershort3.jpg?raw=true',
        image4: 'https://github.com/Jose-Vargas-Guerrero/gymlandImages/blob/main/shein/bykershort4.jpg?raw=true',
        image5: 'https://github.com/Jose-Vargas-Guerrero/gymlandImages/blob/main/shein/bykershort5.JPG?raw=true',
        color: 'Negro, Gris Claro, Naranja, Gris Oscuro',
        category: 'Body fit',
        size: 's',
        price: 430,
        stock: 'Agotado Negro Gris Naranja',
    },
    {
        id: 6,
        name: 'Seamless-Crop-Top',
        productName: 'Seamless Crop Top',
        image1: 'https://github.com/Jose-Vargas-Guerrero/gymlandImages/blob/main/shein/croptop1.jpg?raw=true',
        image2: 'https://github.com/Jose-Vargas-Guerrero/gymlandImages/blob/main/shein/croptop2.jpg?raw=true',
        image3: 'https://github.com/Jose-Vargas-Guerrero/gymlandImages/blob/main/shein/croptop3.jpg?raw=true',
        image4: 'https://github.com/Jose-Vargas-Guerrero/gymlandImages/blob/main/shein/croptop4.jpg?raw=true',
        color: 'Negro, Morado, Rosado, Gris',
        category: 'Body fit',
        size: 'S',
        price: 380,
        stock: 'Negro y rosado agotado',
    },
    {
        id: 7,
        name: 'Set-completo',
        productName: 'Set completo',
        image3: 'https://github.com/Jose-Vargas-Guerrero/gymlandImages/blob/main/shein/setcompleto1.JPG?raw=true',
        image1: 'https://github.com/Jose-Vargas-Guerrero/gymlandImages/blob/main/shein/setcompleto2.JPG?raw=true',
        image2: 'https://github.com/Jose-Vargas-Guerrero/gymlandImages/blob/main/shein/setcompleto3.JPG?raw=true',
        color: 'Verde claro',
        category: 'Body fit',
        size: 'XS | S',
        price: 890,
        stock: '',
    },
    {
        id: 8,
        name: 'Seamles-Crop-tops',
        productName: 'Seamless crop top',
        image1: 'https://github.com/Jose-Vargas-Guerrero/gymlandImages/blob/main/shein/seamlescroptops.JPG?raw=true',
        image2: 'https://github.com/Jose-Vargas-Guerrero/gymlandImages/blob/main/shein/seamlescroptops3.JPG?raw=true',
        image3: 'https://github.com/Jose-Vargas-Guerrero/gymlandImages/blob/main/shein/seamlescroptops2.JPG?raw=true',
        color: 'Negro|verde|rosa|gris',
        category: 'Body fit',
        size: 'M',
        price: 380,
        stock: '',
    },
    {
        id: 9,
        name: 'Jumpsuit',
        productName: 'Jumpsuit',
        image1: 'https://github.com/Jose-Vargas-Guerrero/gymlandImages/blob/main/shein/Jumpsuit1.JPG?raw=true',
        image2: 'https://github.com/Jose-Vargas-Guerrero/gymlandImages/blob/main/shein/Jumpsuit2.JPG?raw=true',
        image3: 'https://github.com/Jose-Vargas-Guerrero/gymlandImages/blob/main/shein/Jumpsuit3.JPG?raw=true',
        color: 'Negro',
        category: 'Body fit',
        size: 'S | M',
        price: 850,
        stock: 'Agotado',
    },
    {
        id: 10,
        name: 'Tennis-Basic-1',
        productName: 'Tennis Bassic',
        image1: 'https://github.com/Jose-Vargas-Guerrero/gymlandImages/blob/main/shein/Tennisbasic1.JPG?raw=true',
        image2: 'https://github.com/Jose-Vargas-Guerrero/gymlandImages/blob/main/shein/Tennisbasic2.JPG?raw=true',
        image3: 'https://github.com/Jose-Vargas-Guerrero/gymlandImages/blob/main/shein/Tennisbasic3.JPG?raw=true',
        color: 'Rosado',
        category: 'Body fit',
        size: 'S | M',
        price: 495,
        stock: '',
    },
    {
        id: 11,
        name: 'Tennis-Basic-2',
        productName: 'Tennis Bassic',
        image1: 'https://github.com/Jose-Vargas-Guerrero/gymlandImages/blob/main/shein/Tennisbasic2-1.JPG?raw=true',
        image2: 'https://github.com/Jose-Vargas-Guerrero/gymlandImages/blob/main/shein/Tennisbasic%202-2.JPG?raw=true',
        color: 'Morado',
        category: 'Body fit',
        size: 'S | M',
        price: 520,
        stock: 'talla M agotada',
    },
    {
        id: 12,
        name: 'Gym-shorts-levanta-glúteo',
        productName: 'Gym shorts levanta glúteo',
        image1: 'https://github.com/Jose-Vargas-Guerrero/gymlandImages/blob/main/shein/Gymshortslevantagl%C3%BAteo2.JPG?raw=true',
        image2: 'https://github.com/Jose-Vargas-Guerrero/gymlandImages/blob/main/shein/Gymshortslevantagl%C3%BAteo1.JPG?raw=true',
        image3: 'https://github.com/Jose-Vargas-Guerrero/gymlandImages/blob/main/shein/Gymshortslevantagl%C3%BAteo3.JPG?raw=true',
        image4: 'https://github.com/Jose-Vargas-Guerrero/gymlandImages/blob/main/shein/Gymshortslevantagl%C3%BAteo3.JPG?raw=true',
        color: 'Negro verde rosa gris',
        category: 'Body fit',
        size: 'M',
        price: 395,
        stock: '',
    },
    {
        id: 13,
        name: 'Sujetador-deportivo-1',
        productName: 'Sujetador deportivo',
        image1: 'https://github.com/Jose-Vargas-Guerrero/gymlandImages/blob/main/shein/Sujetadordeportivo2.JPG?raw=true',
        image2: 'https://github.com/Jose-Vargas-Guerrero/gymlandImages/blob/main/shein/Sujetadordeportivo1.JPG?raw=true',
        image3: 'https://github.com/Jose-Vargas-Guerrero/gymlandImages/blob/main/shein/Sujetadordeportivo3.JPG?raw=true',
        image4: 'https://github.com/Jose-Vargas-Guerrero/gymlandImages/blob/main/shein/Sujetadordeportivo4.JPG?raw=true',
        image5: 'https://github.com/Jose-Vargas-Guerrero/gymlandImages/blob/main/shein/Sujetadordeportivo5.JPG?raw=true',
        image6: 'https://github.com/Jose-Vargas-Guerrero/gymlandImages/blob/main/shein/Sujetadordeportivo6.JPG?raw=true',
        color: 'Negro | Blanco',
        category: 'Body fit',
        size: 'M',
        price: 330,
        stock: '',
    },
    {
        id: 14,
        name: 'Mini-llavero',
        productName: 'Mini llavero',
        image1: 'https://github.com/Jose-Vargas-Guerrero/gymlandImages/blob/main/shein/minillavero1.JPG?raw=true',
        image2: 'https://github.com/Jose-Vargas-Guerrero/gymlandImages/blob/main/shein/minillavero2.JPG?raw=true',
        image3: 'https://github.com/Jose-Vargas-Guerrero/gymlandImages/blob/main/shein/minillavero3.JPG?raw=true',
        image4: 'https://github.com/Jose-Vargas-Guerrero/gymlandImages/blob/main/shein/minillavero4.JPG?raw=true',
        color: 'Negro',
        category: 'Accesorio',
        size: 'small',
        price: 250,
        stock: '',
    },
    {
        id: 15,
        name: 'Camisa-Oversize-1',
        productName: 'Camisa Oversize',
        image1: 'https://github.com/Jose-Vargas-Guerrero/gymlandImages/blob/main/shein/camisaoversize1.JPG?raw=true',
        image2: 'https://github.com/Jose-Vargas-Guerrero/gymlandImages/blob/main/shein/camisaoversize2.JPG?raw=true',
        color: 'Blanco',
        category: 'Prenda',
        size: 'M',
        price: 450,
        stock: 'agotado',
    },
    {
        id: 16,
        name: 'Camisa-Oversize-2',
        productName: 'Camisa Oversize',
        image2: 'https://github.com/Jose-Vargas-Guerrero/gymlandImages/blob/main/shein/Camisaoversize2-1.JPG?raw=true',
        image1: 'https://github.com/Jose-Vargas-Guerrero/gymlandImages/blob/main/shein/Camisaoversize2-2.JPG?raw=true',
        color: 'Negro',
        category: 'Prenda',
        size: 'M',
        price: 450,
        stock: '',
    },
    {   
        id: 17,
        name: 'Bandita-para-el-cabello',
        productName: 'Banditas para el cabello',
        image1: 'https://github.com/Jose-Vargas-Guerrero/gymlandImages/blob/main/shein/banditasparaelcabello1.JPG?raw=true',
        image2: 'https://github.com/Jose-Vargas-Guerrero/gymlandImages/blob/main/shein/banditasparaelcabello2.JPG?raw=true',
        image3: 'https://github.com/Jose-Vargas-Guerrero/gymlandImages/blob/main/shein/banditasparaelcabello3.JPG?raw=true',
        image4: 'https://github.com/Jose-Vargas-Guerrero/gymlandImages/blob/main/shein/banditasparaelcabello4.JPG?raw=true',
        image5: 'https://github.com/Jose-Vargas-Guerrero/gymlandImages/blob/main/shein/banditasparaelcabello5.JPG?raw=true',
        image6: 'https://github.com/Jose-Vargas-Guerrero/gymlandImages/blob/main/shein/banditasparaelcabello6.JPG?raw=true',
        color: 'Negro|Cafe|Blanco|Rosado|',
        category: 'Accesorios',
        size: 'M',
        price: 30,
        stock: 'Agotado',
    }, 
    {   
        id: 18,
        name: 'Tennis-Basic-Black-White',
        productName: 'Tennis Bassic',
        image1: 'https://github.com/Jose-Vargas-Guerrero/gymlandImages/blob/main/shein/TennisbasicBlack_White1.JPG?raw=true',
        image2: 'https://github.com/Jose-Vargas-Guerrero/gymlandImages/blob/main/shein/TennisbasicBlack_White2.JPG?raw=true',
        color: 'Blanco|Negro',
        category: 'Prenda',
        size: 'M',
        price: 595,
    },
    {   
        id: 19,
        name: 'Set-Completo-Akatsuki',
        productName: 'Set Completo Akatsuki',
        image1: 'https://github.com/Jose-Vargas-Guerrero/gymlandImages/blob/main/shein/SetcompletoAkatsuki.JPG?raw=true',
        image2: 'https://github.com/Jose-Vargas-Guerrero/gymlandImages/blob/main/shein/SetcompletoAkatsuki.JPG?raw=true',
        color: 'Negro',
        category: 'Body fit',
        size: 'M',
        price: 1695,
    },
    {   
        id: 20,
        name: 'Set-Completo-Brown',
        productName: 'Set Completo Cafe',
        image1: 'https://github.com/Jose-Vargas-Guerrero/gymlandImages/blob/main/shein/Setcompletobrown3.jpg?raw=true',
        image2: 'https://github.com/Jose-Vargas-Guerrero/gymlandImages/blob/main/shein/Setcompletobrown2.jpg?raw=true',
        color: 'Cafe',
        category: 'Body fit',
        size: 'M',
        price: 1695,
    },
    {   
        id: 21,
        name: 'Set-Completo-Black',
        productName: 'Set Completo Negro',
        image1: 'https://github.com/Jose-Vargas-Guerrero/gymlandImages/blob/main/shein/Setcompletoblack2.JPG?raw=true',
        image2: 'https://github.com/Jose-Vargas-Guerrero/gymlandImages/blob/main/shein/Setcompletoblack1.JPG?raw=true',
        image3: 'https://github.com/Jose-Vargas-Guerrero/gymlandImages/blob/main/shein/Setcompletoblack1.JPG?raw=true',
        color: 'Negro',
        category: 'Body fit',
        size: 'S | M',
        price: 1695,
        stock: 'Agotado',
    },
    {   
        id: 22,
        name: 'Set-Completo-Black-Wolves',
        productName: 'Sports Bra',
        image1: 'https://github.com/Jose-Vargas-Guerrero/gymlandImages/blob/main/shein/SportsBraWolve1.JPG?raw=true',
        image2: 'https://github.com/Jose-Vargas-Guerrero/gymlandImages/blob/main/shein/SportsBraWolve2.JPG?raw=true',
        color: 'Negro',
        category: 'Body fit',
        size: 'M',
        price: 875,
    },
    {   
        id: 23,
        name: 'Celsius-On-The-Go-Berry',
        productName: 'Celsisu On the Go Berry',
        image1: 'https://github.com/Jose-Vargas-Guerrero/gymlandImages/blob/main/shein/Celsius%20On-The-Go1.JPG?raw=true',
        image2: 'https://m.media-amazon.com/images/I/817S691c6UL._AC_SX679_.jpg',
        size: '14',
        price: 690,
    },
    {   
        id: 24,
        name: 'Celsius-On-The-Go-Kiwi',
        productName: 'Celsisu On the Go Kiwi',
        image1: 'https://github.com/Jose-Vargas-Guerrero/gymlandImages/blob/main/shein/Celsius%20On-The-Go2.JPG?raw=true',
        image2: 'https://m.media-amazon.com/images/I/81tlC7mQl6L._AC_SX679_.jpg',
        size: '14',
        price: 690,
    }, 

];

const $$Astro$1 = createAstro();
async function getStaticPaths$1() {
  const info = wproducts$1;
  return info.map((p) => {
    return {
      params: { name: p.name },
      props: { p }
    };
  });
}
const $$name$1 = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$name$1;
  const { name } = Astro2.params;
  const { p } = Astro2.props;
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": name, "data-astro-cid-255u5wwk": true }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="gallery-container" data-astro-cid-255u5wwk> <div class="gallery-images" data-astro-cid-255u5wwk> <div class="gallery-inner" data-astro-cid-255u5wwk> <img loading="lazy" class="gallery-image"${addAttribute(p.image1, "src")} data-astro-cid-255u5wwk> <img loading="lazy" class="gallery-image"${addAttribute(p.image2, "src")} data-astro-cid-255u5wwk> <img loading="lazy" class="gallery-image"${addAttribute(p.image3, "src")} data-astro-cid-255u5wwk> <img loading="lazy" class="gallery-image"${addAttribute(p.image4, "src")} data-astro-cid-255u5wwk> <img loading="lazy" class="gallery-image"${addAttribute(p.image5, "src")} data-astro-cid-255u5wwk> <img loading="lazy" class="gallery-image"${addAttribute(p.image6, "src")} data-astro-cid-255u5wwk> </div> </div> <div class="gallery-info" data-astro-cid-255u5wwk> <div class="box" data-astro-cid-255u5wwk> <h2 data-astro-cid-255u5wwk>${p.productName}</h2> <h2 data-astro-cid-255u5wwk>L.${p.price}</h2> <p data-astro-cid-255u5wwk>Color:${p.color}</p> <p data-astro-cid-255u5wwk>${p.category}</p> <p class="space" data-astro-cid-255u5wwk>Size: ${p.size}</p> <a class="wlink"${addAttribute(`https://api.whatsapp.com/send?phone=+50488704030&text=\xA1Hola! en que podemos ayudarte?`, "href")} target="_blank" data-astro-cid-255u5wwk>
contactar</a> </div> </div> </div> ${renderComponent($$result2, "Footer", $$Footer, { "data-astro-cid-255u5wwk": true })} ` })} `;
}, "C:/Users/frava/OneDrive/Escritorio/proyectos/gymlandV2/src/pages/sproducts/[name].astro", void 0);

const $$file$1 = "C:/Users/frava/OneDrive/Escritorio/proyectos/gymlandV2/src/pages/sproducts/[name].astro";
const $$url$1 = "/sproducts/[name]";

const _name_$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$name$1,
  file: $$file$1,
  getStaticPaths: getStaticPaths$1,
  url: $$url$1
}, Symbol.toStringTag, { value: 'Module' }));

const wproducts = [
    {
      id: 1,
      name: "Power-Seamless-Cycling-Shorts",
      productName: "Cycling Shorts y Sports Bra",
      image1:
        "https://www.womensbest.com/cdn/shop/products/Power_CyclingShorts_RoyalBlue_01_6be47071-d123-4bf1-80c1-3fd39682da0e_800x.jpg?v=1683120098",
      image2:
        "https://www.womensbest.com/cdn/shop/products/Power_CyclingShorts_RoyalBlue_02_a662515e-dc28-4715-842f-7af8f961fd17_800x.jpg?v=1683120098",
      image3:
        "https://www.womensbest.com/cdn/shop/products/Power_CyclingShorts_RoyalBlue_03_d806434f-2a84-4656-89ed-da5bb6c2df80_800x.jpg?v=1683120098",
      image4:
        "https://www.womensbest.com/cdn/shop/products/Power_CyclingShorts_RoyalBlue_04_cececa39-81e2-4ab4-99a2-ae6d2b49e2c5_800x.jpg?v=1683120098",
      image5:
        "https://www.womensbest.com/cdn/shop/products/Power_CyclingShorts_RoyalBlue_05_524322c9-cfdf-4f7b-b49b-4665acaa7a40_800x.jpg?v=1683120098",
      image6:
        "https://www.womensbest.com/cdn/shop/products/Power_CyclingShorts_RoyalBlue_06_7e64dd52-791a-4952-b67c-3bfd2c4ec20d_800x.jpg?v=1683120098",
      color: "Royal Blue",
      category: "Set completo de 2 piezas",
      size: "S",
      price: 1290,
    },
    {
      id: 2,
      name: "Power-Seamless-Sports-Bra",
      productName: "Leggins y Sports Bra",
      image1:
        "https://www.womensbest.com/cdn/shop/products/Power_Bra_RoyalBlue_01_0abd2975-e7e1-4c9d-8074-810578e506c8_800x.jpg?v=1683120047",
      image2:
        "https://www.womensbest.com/cdn/shop/products/Power_Bra_RoyalBlue_02_11087fc4-0412-48e8-b374-ba90088361d3_800x.jpg?v=1683120047",
      image3:
        "https://www.womensbest.com/cdn/shop/products/Power_Bra_RoyalBlue_03_ea5d717b-69cf-49ab-9ad8-c05c75ced5bf_800x.jpg?v=1683120047",
      image4:
        "https://www.womensbest.com/cdn/shop/products/Power_Bra_RoyalBlue_04_afca113f-3476-4eb1-8efc-da8719f8edd3_800x.jpg?v=1683120048",
      image5:
        "https://www.womensbest.com/cdn/shop/products/Power_Bra_RoyalBlue_05_0caf0165-f06a-4a13-8c77-70efb18c7a32_800x.jpg?v=1683120048",
      image6:
        "https://www.womensbest.com/cdn/shop/products/Power_Bra_RoyalBlue_06_f87b3d8e-a6fd-48a6-a7b2-32c4a9739e77_800x.jpg?v=1683120048",
      color: "Royal Blue",
      category: "Set completo de 2 piezas",
      size: "S",
      price: 1390,
    },
    {
      id: 3,
      name: "Power-Seamless-Sports-Bra-Black",
      productName: "Legginsg y Sports Bra",
      image1:
        "https://www.womensbest.com/cdn/shop/files/Power_Bra_Black_01_800x.jpg?v=1686910629",
      image2:
        "https://www.womensbest.com/cdn/shop/files/Power_Bra_Black_03_d2d96b1f-6fb8-4795-a14c-0909b2b709d4_800x.jpg?v=1705487312",
      image3:
        "https://www.womensbest.com/cdn/shop/files/Power_Bra_Black_04_039a6725-6efd-4271-9b23-b57e78f40183_800x.jpg?v=1705487312",
      image4:
        "https://www.womensbest.com/cdn/shop/files/Power_Bra_Black_06_08ea3c6b-46cc-44d8-88ee-01f15beba019_800x.jpg?v=1705487313",
      image5:
        "https://www.womensbest.com/cdn/shop/files/Power_Bra_Black_06_800x.jpg?v=1686910766",
      image6:
        "https://www.womensbest.com/cdn/shop/files/Power_Bra_Black_05_800x.jpg?v=1686910766",
      color: "Black",
      category: "set completo de 2 piezas",
      size: "S | M",
      price: 1690,
    },
    /*  {
          id: 4,
          name: 'Power-Seamless-Leggings-Black',
          productName: 'Power Seamless Leggings',
          image1: 'https://www.womensbest.com/cdn/shop/files/Power_Leggings_Black_01_800x.jpg?v=1686910619',
          image2: 'https://www.womensbest.com/cdn/shop/files/Power_Leggings_Black_02_800x.jpg?v=1686910620',
          image3: 'https://www.womensbest.com/cdn/shop/files/Power_Leggings_Black_03_800x.jpg?v=1686910619',
          image4: 'https://www.womensbest.com/cdn/shop/files/Power_Leggings_Black_04_800x.jpg?v=1686910619',
          image5: 'https://www.womensbest.com/cdn/shop/files/Power_Leggings_Black_05_800x.jpg?v=1686910620',
          image6: 'https://www.womensbest.com/cdn/shop/files/Power_Leggings_Black_06_800x.jpg?v=1686910620',
          color: 'Black',
          category: 'Body fit',
          size: 'S | M',
          price: 1490
      }, */
  
    {
      id: 7,
      name: "Power-Seamless-Leggings-Graphite",
      productName: "Power Seamless Leggings y Sports Bra",
      image1:
        "https://www.womensbest.com/cdn/shop/products/Power_Leggings_Graphite_01_800x.jpg?v=1691744495",
      image2:
        "https://www.womensbest.com/cdn/shop/products/Power_Leggings_Graphite_02_800x.jpg?v=1691744495",
      image3:
        "https://www.womensbest.com/cdn/shop/products/Power_Leggings_Graphite_04_800x.jpg?v=1692166109",
      image4:
        "https://www.womensbest.com/cdn/shop/products/Power_Leggings_Graphite_03_800x.jpg?v=1692166109",
      image5:
        "https://www.womensbest.com/cdn/shop/products/Power_Leggings_Graphite_05_800x.jpg?v=1691744495",
      image6:
        "https://www.womensbest.com/cdn/shop/products/Power_Leggings_Graphite_06_800x.jpg?v=1691744495",
      color: "Graphite",
      category: "set completo de 2 piezas",
      size: "M",
      price: 1690,
    },
    {
      id: 8,
      name: "Power-Seamless-Long-Sleeve-Crop-Top",
      productName: "Power Seamless Long Sleeve Crop Top",
      image1:
        "https://www.womensbest.com/cdn/shop/products/Power_LongSleeve_Graphite_01_800x.jpg?v=1691744567",
      image2:
        "https://www.womensbest.com/cdn/shop/products/Power_LongSleeve_Graphite_02_800x.jpg?v=1691744567",
      image3:
        "https://www.womensbest.com/cdn/shop/products/Power_LongSleeve_Graphite_03_800x.jpg?v=1691744567",
      image4:
        "https://www.womensbest.com/cdn/shop/products/Power_LongSleeve_Graphite_04_800x.jpg?v=1691744567",
      image5:
        "https://www.womensbest.com/cdn/shop/products/Power_LongSleeve_Graphite_05_800x.jpg?v=1691744567",
      image6:
        "https://www.womensbest.com/cdn/shop/products/Power_LongSleeve_Graphite_06_800x.jpg?v=1691744567",
      color: "Graphite",
      category: "Body fit",
      size: "S",
      price: 990,
  
    },
    {
      id: 9,
      name: "Power-Seamless-Cycling-Shorts-Graphite",
      productName: "Power Seamless Cycling Shorts y sports Bra",
      image1:
        "https://www.womensbest.com/cdn/shop/products/Power_CyclingShorts_Graphite_01_800x.jpg?v=1691744518",
      image2:
        "https://www.womensbest.com/cdn/shop/products/Power_CyclingShorts_Graphite_02_800x.jpg?v=1691744518",
      image3:
        "https://www.womensbest.com/cdn/shop/products/Power_CyclingShorts_Graphite_03_800x.jpg?v=1691744518",
      image4:
        "https://www.womensbest.com/cdn/shop/products/Power_CyclingShorts_Graphite_04_800x.jpg?v=1691744518",
      image5:
        "https://www.womensbest.com/cdn/shop/products/Power_CyclingShorts_Graphite_05_800x.jpg?v=1691744518",
      image6:
        "https://www.womensbest.com/cdn/shop/products/Power_CyclingShorts_Graphite_06_800x.jpg?v=1691744518",
      color: "Graphite",
      category: "set completo de 2 piezas",
      size: "S",
      price: 1590,
    },
    {
      id: 10,
      name: "Power-Seamless-Short-Sleeve-Crop-Top-Dark-Cherry",
      productName: "Power Seamless Short y Sleeve Crop Top",
      image1:
        "https://www.womensbest.com/cdn/shop/products/Power_ShortSleeve_DarkCherry_01_800x.jpg?v=1691744483",
      image2:
        "https://www.womensbest.com/cdn/shop/products/Power_ShortSleeve_DarkCherry_02_800x.jpg?v=1691744483",
      image3:
        "https://www.womensbest.com/cdn/shop/products/Power_ShortSleeve_DarkCherry_03_800x.jpg?v=1691744483",
      image4:
        "https://www.womensbest.com/cdn/shop/products/Power_ShortSleeve_DarkCherry_04_800x.jpg?v=1691744483",
      image5:
        "https://www.womensbest.com/cdn/shop/products/Power_ShortSleeve_DarkCherry_05_800x.jpg?v=1691744483",
      image6:
        "https://www.womensbest.com/cdn/shop/products/Power_ShortSleeve_DarkCherry_06_800x.jpg?v=1691744483",
      color: "Dark Cherry",
      category: "set completo de 2 piezas",
      size: "S",
      price: 1690,
      stock: 'Agotado',
    },
    {
      id: 11,
      name: "Power-Seamless-Cycling-Shorts-Dark-Cherry",
      productName: "Power Seamless Cycling Shorts",
      image1:
        "https://www.womensbest.com/cdn/shop/products/Power_CyclingShorts_DarkCherry_01_800x.jpg?v=1691744530",
      image2:
        "https://www.womensbest.com/cdn/shop/products/Power_CyclingShorts_DarkCherry_02_800x.jpg?v=1691744530",
      image3:
        "https://www.womensbest.com/cdn/shop/products/Power_CyclingShorts_DarkCherry_03_800x.jpg?v=1691744530",
      image4:
        "https://www.womensbest.com/cdn/shop/products/Power_CyclingShorts_DarkCherry_04_800x.jpg?v=1691744530",
      image5:
        "https://www.womensbest.com/cdn/shop/products/Power_CyclingShorts_DarkCherry_05_800x.jpg?v=1691744530",
      image6:
        "https://www.womensbest.com/cdn/shop/products/Power_CyclingShorts_DarkCherry_06_800x.jpg?v=1691744530",
      color: "Dark Cherry",
      category: "Body fit",
      size: "S",
      price: 990,
    },
    {
      id: 12,
      name: "Power-Seamless-Long-Sleeve-Crop-Top-Walnut-Brown",
      productName: "Power Seamless Long Sleeve Crop",
      image1:
        "https://www.womensbest.com/cdn/shop/products/Power_LongSleeve_WalnutBrown_01_37a28aa5-616a-4826-ae43-510547db7ae2_800x.jpg?v=1683206283",
      image2:
        "https://www.womensbest.com/cdn/shop/products/Power_LongSleeve_WalnutBrown_03_0edd7320-919e-4482-8855-5425608dca8d_800x.jpg?v=1683120981",
      image3:
        "https://www.womensbest.com/cdn/shop/products/Power_LongSleeve_WalnutBrown_04_f65964cd-24bf-4d2d-85bf-3072d57298d8_800x.jpg?v=1683120981",
      image4:
        "https://www.womensbest.com/cdn/shop/products/Power_LongSleeve_WalnutBrown_05_b5eccd74-ddf1-4f30-b430-82156451a347_800x.jpg?v=1683120981",
      image5:
        "https://www.womensbest.com/cdn/shop/products/Power_LongSleeve_WalnutBrown_06_4398c369-3259-41fe-a191-7006bb939c18_800x.jpg?v=1683120981",
      color: "Walnut Brown",
      category: "Body fit",
      size: "S",
      price: 990,
    },
    {
      id: 13,
      name: "Power-Seamless-Cycling-Shorts-Walnut-Brown",
      productName: "Sport Bra y Power Seamless Cycling Shorts",
      image1:
        "https://www.womensbest.com/cdn/shop/products/Power_Shorts_WalnutBrown_03_67628974-886f-4130-a978-725f7575b242_800x.jpg?v=1683120936",
      image2:
        "https://www.womensbest.com/cdn/shop/products/Power_Shorts_WalnutBrown_01_c425be4d-9a8c-497d-8026-6b74b6c263e9_800x.jpg?v=1683206139",
      image3:
        "https://www.womensbest.com/cdn/shop/products/Power_Shorts_WalnutBrown_04_730ba4c2-be06-43f1-91f9-0e5fa83ee9da_800x.jpg?v=1683120936",
      image4:
        "https://www.womensbest.com/cdn/shop/products/Power_Shorts_WalnutBrown_05_cfb8df8f-e853-4659-ad8c-77af54271788_800x.jpg?v=1683120936",
      image5:
        "https://www.womensbest.com/cdn/shop/products/Power_Shorts_WalnutBrown_06_67ed0af4-9278-412d-8318-34f5cbf31f26_800x.jpg?v=1683120936",
      color: "Walnut Brown",
      category: "Set completo de 2 piezas",
      size: "S",
      price: 1590,
    },
  ];

const $$Astro = createAstro();
async function getStaticPaths() {
  const info = wproducts;
  return info.map((p) => {
    return {
      params: { name: p.name },
      props: { p }
    };
  });
}
const $$name = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$name;
  const { name } = Astro2.params;
  const { p } = Astro2.props;
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": name, "data-astro-cid-jwa3xvnc": true }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="gallery-container" data-astro-cid-jwa3xvnc> <div class="gallery-images" data-astro-cid-jwa3xvnc> <div class="gallery-inner" data-astro-cid-jwa3xvnc> <img loading="lazy" class="gallery-image"${addAttribute(p.image1, "src")} data-astro-cid-jwa3xvnc> <img loading="lazy" class="gallery-image"${addAttribute(p.image2, "src")} data-astro-cid-jwa3xvnc> <img loading="lazy" class="gallery-image"${addAttribute(p.image3, "src")} data-astro-cid-jwa3xvnc> <img loading="lazy" class="gallery-image"${addAttribute(p.image4, "src")} data-astro-cid-jwa3xvnc> <img loading="lazy" class="gallery-image"${addAttribute(p.image5, "src")} data-astro-cid-jwa3xvnc> <img loading="lazy" class="gallery-image"${addAttribute(p.image6, "src")} data-astro-cid-jwa3xvnc> </div> </div> <div class="gallery-info" data-astro-cid-jwa3xvnc> <div class="box" data-astro-cid-jwa3xvnc> <h2 data-astro-cid-jwa3xvnc>${p.productName}</h2> <h2 data-astro-cid-jwa3xvnc>L.${p.price}</h2> ${p.sales && renderTemplate`<strong class="price sales" data-astro-cid-jwa3xvnc>Oferta: ${p.packet} L. ${p.sales}</strong>`} <p data-astro-cid-jwa3xvnc>${p.color}</p> <p data-astro-cid-jwa3xvnc>${p.category}</p> <p data-astro-cid-jwa3xvnc>Size: ${p.size}</p> <a class="wlink"${addAttribute(`https://api.whatsapp.com/send?phone=+50488704030&text=\xA1Hola! en que podemos ayudarte?`, "href")} target="_blank" data-astro-cid-jwa3xvnc>
contactar</a> </div> </div> </div> ${renderComponent($$result2, "Footer", $$Footer, { "data-astro-cid-jwa3xvnc": true })} ` })} `;
}, "C:/Users/frava/OneDrive/Escritorio/proyectos/gymlandV2/src/pages/wbest/[name].astro", void 0);

const $$file = "C:/Users/frava/OneDrive/Escritorio/proyectos/gymlandV2/src/pages/wbest/[name].astro";
const $$url = "/wbest/[name]";

const _name_ = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$name,
  file: $$file,
  getStaticPaths,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

export { $$Footer as $, _name_$2 as _, gymsharkProducts as a, $$Layout as b, wproducts as c, _name_$1 as d, _name_ as e, getConfiguredImageService as g, imageConfig as i, wproducts$1 as w };

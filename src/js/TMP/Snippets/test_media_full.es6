module.exports = class Counter {
  constructor(options) {
    this.settings = {
      video: {
        mp4: {
          type: 'video/mp4',
          codecs: [
            'avc1.66.13,  mp4a.40.2', // MPEG4, AVC(H.264) Baseline 1.3, AAC-LC, [MPEG-4 AVC/H.264]
            'avc1.42e01e, mp4a.40.2', // MPEG4, AVC(H.264) Baseline 1.3, AAC-LC, [MPEG-4 AVC/H.264]
            'avc1.66.30,  mp4a.40.5', // MPEG4, AVC(H.264) Baseline 3.0, AAC-HC, [MPEG-4 AVC/H.264]
            'avc1.42001e, mp4a.40.5', // MPEG4, AVC(H.264) Baseline 3.0, AAC-HC, [MPEG-4 AVC/H.264]
            'avc1.42001f, mp4a.40.5', // MPEG4, AVC(H.264) Baseline 3.1, AAC-HC, [MPEG-4 AVC/H.264]
            'avc1.4d001e, mp4a.40.2', // MPEG4, AVC(H.264) Main 3.0, AAC-LC,     [MPEG-4 AVC/H.264]
            'avc1.77.30,  mp4a.40.5', // MPEG4, AVC(H.264) Main 3.0, AAC-HC,     [MPEG-4 AVC/H.264]
            'avc1.4d001e, mp4a.40.5', // MPEG4, AVC(H.264) Main 3.0, AAC-HC,     [MPEG-4 AVC/H.264]
            'avc1.4d001f, mp4a.40.5', // MPEG4, AVC(H.264) Main 3.1, AAC-HC,     [MPEG-4 AVC/H.264]
            'avc1.640029, mp4a.40.5', // MPEG4, AVC(H.264) High 4.1, AAC-HC,     [MPEG-4 AVC/H.264]
            'avc1.640029, mp4a.40.2', // MPEG4, AVC(H.264) High 4.1, AAC-LC,     [MPEG-4 AVC/H.264]
            'mp4v.20.8, mp4a.40.3',   // MPEG4 visual, MP4, MP3
            'mp4v.20.8, samr'         // MPEG4 visual, MP4(3GP), AMR
          ]
        },
        webm: {
          type: 'video/webm',
          codecs: [
            'vp8, vorbis', // WebM, VP9, Vorbis
            'vp9, vorbis'  // WebM, VP9, Vorbis
          ]
        },
        ogg: {
          type: 'video/ogg',
          codecs: [
            'theora, vorbis' // ogg, theora, Vorbis
          ]
        },
        m4v: {
          type: 'video/x-m4v'
        },
        mov: {
          type: 'video/quicktime'
        }
      },
      audio: {
        mp4: {
          type: 'audio/mp4',
          codecs: [
            'mp4a.40.2', // MPEG4 AAC-LC
            'mp4a.40.5', // MPEG4 HE-AAC,
            'mp4a.a5',
            'mp4a.a6',
            'mp4a.67',   // MPEG2 AAC-LC
            'mp4a.69',
            'mp4a.6b',
            'aac51',
            'ac-3',
            'ec-3'
          ]
        },
        mp3: {
          type: 'mp3'
        },
        webm: {
          type: 'audio/webm',
          codecs: [
            'vorbis' // WebM, Vorbis
          ]
        },
        ogg: {
          type: 'audio/ogg',
          codecs: 'vorbis' // OGG, Vorbis
        },
        mpeg: {
          type: 'audio/mpeg',
          codecs: 'mp3'
        }
      }
    };
    Object.assign(this.settings, options);
    this.video = document.createElement('video');
    this.MediaSource = window.MediaSource || window.WebKitMediaSource;
  }
  set (property, value) {
    return this[property] = value;
  }
  get (property) {
    return this[property];
  }
  test(type, codecs, formats = false) {
    let types = this.getTypes(type, codecs, formats);
    let result = {};
    let types_length = types.length;
    for(var i = types_length; i > 0; i--) {
      let index = types_length - i;
      let supported = this.MediaSource.isTypeSupported(types[index]);
      let can_play = this.video.canPlayType(types[index]) || false;
      result[types[index]] = {
        supported: supported,
        can_play: can_play
      };
    }
    return result;
  }
  getStrict(format) {
    return this.MediaSource.isTypeSupported(format);
  }
  getStrictSupported(formats) {
    if(formats.constructor !== Array) {
      formats = [formats];
    }
    let formats_length = formats.length;
    for(let i = formats_length; i > 0; i--) {
      let index = formats_length - i;
      if(this.getStrict(formats[index])) {
        return {
          format: formats[index],
          index: index
        };
      }
    }
    return false;
  }
  getSupported(type, formats) {
    let types = this.getTypes(type, false, formats);
    let result = false;
    let types_length = types.length;
    for(var i = types_length; i > 0; i--) {
      let index = types_length - i;
      if(this.MediaSource.isTypeSupported(types[index])) {
        result = true;
        break;
      };
    }
    return result;
  }
  getCodecs(type, format) {
    let result = [];
    let data = this.settings[type][format];
    let item_type = type + '/' + format;
    if(data.codecs) {
      let codecs_length = data.codecs.length;
      for(var i = codecs_length; i >= 0; i--) {
      let index = codecs_length - i;
        result.push(item_type + '; codecs="' + data.codecs[index] + '"');
      }
    }
    else {
      result.push(item_type);
    }
    return result;
  }
  getTypes(type, codecs = false, formats = false) {
    if(!(type.toLowerCase() === 'video' || type.toLowerCase() === 'audio')) {
      throw new Error('Wrong type!');
    }
    let data = this.settings[type];
    let result = [];
    if(formats) {
      if(formats.constructor !== Array) {
        formats = [formats];
      }
    }
    else {
      formats = Object.keys(data);
    }
    let formats_length = formats.length;
    for(let i = formats_length; i > 0; i--) {
      let index = formats_length - i;
      let format = formats[index];
      let item_type = type + '/' + format;
      if(!data[format] || !codecs) {
        result.push(item_type);
      }
      else {
        let codecs = this.getCodecs(type, format);
        result = result.concat(codecs);
      }
    }
    return result;
  }
}

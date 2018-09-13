import { InjectionToken } from '@angular/core';
import { IPlayer } from './modules/data-providers/players-data/player.interface';

// tslint:disable:max-line-length
const configuration = {

    // Alfie Burden
    21: <IPlayer>{

        photo: 'http://www.snookercentral.com/wp-content/uploads/2017/01/alfie_burden_006_b-800x445.jpg'
    },
    // Allan Taylor
    26: <IPlayer>{

        photo: 'https://pbs.twimg.com/media/C760HztXwAIEY6i.jpg'
    },
    // Alan McManus
    44: <IPlayer>{

        photo: 'https://media.gettyimages.com/photos/alan-mcmanus-of-scotland-reacts-in-his-first-round-match-against-of-picture-id912994258?k=6&m=912994258&s=612x612&w=0&h=z344ixjp6IdvF5jDyoOhhhAMeEJzc1Fih5E5olz8AtU='
    },
    // Andrew Norman
    60: <IPlayer>{

        photo: 'https://archive.li/RbE5u/3a6a99c6ce8aa49d6b8b400343f6f51fcf4c87da'
    },
    // Andrew Pagett
    65: <IPlayer>{

        photo: 'http://www.southwalesargus.co.uk/resources/images/2880910/'
    },
    // Adam Duffy
    74: <IPlayer>{

        photo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/11/Adam_Duffy_PHC_2016-1.jpg/1200px-Adam_Duffy_PHC_2016-1.jpg'
    },
    // Anda Zhang
    81: <IPlayer>{

        photo: 'http://www3.pictures.zimbio.com/gi/Zhang+Anda+Betfred+com+World+Snooker+Championships+lXpCrEjOerQl.jpg'
    },
    // Ahmed Saif
    98: <IPlayer>{

        photo: 'http://dohastadiumplusqatar.com/PostImageUploadFolder/5303657741123201673119AM.jpg'
    },
    // Adam Stefanow
    104: <IPlayer>{

        photo: 'https://www.wpbsa.com/wp-content/uploads/2018/03/Stefanow1.jpg'
    },
    // Aditya Mehta
    108: <IPlayer>{

        photo: 'http://images.mid-day.com/2013/oct/Aditya-Mehta.jpg'
    },
    // Andy Lee
    123: <IPlayer>{

        photo: 'https://i1.wp.com/sportsroad.hk/wp-content/uploads/2018/04/andyleechunwai_snooker.jpeg?resize=800%2C605'
    },
    // Alex Davies
    144: <IPlayer>{

        photo: 'https://media.gettyimages.com/photos/alex-davies-during-his-1st-round-game-against-fergal-o-brien-on-day-picture-id852712504?k=6&m=852712504&s=612x612&w=0&h=na_VGb-3i8QtMoolCOQTgeMEw0ZFT3fWm-q505t7Rp0='
    },
    // Alexander Ursenbacher
    239: <IPlayer>{

        photo: 'https://cdn.images.express.co.uk/img/dynamic/4/590x/English-Open-Snooker-Alexander-Ursenbacher-Roger-Federer-869349.jpg'
    },
    // Alex Borg
    515: <IPlayer>{

        photo: 'https://dafasnooker.com/wp-content/uploads/2017/12/Alex-Borg-1024x768-player-listings.jpg'
    },
    // Ashley Carty
    724: <IPlayer>{

        photo: 'https://alchetron.com/cdn/ashley-carty-b8a35e6e-f294-495b-a6fb-09fb7c2e230-resize-750.jpeg'
    },
    // Ashley Hugill
    1323: <IPlayer>{

        photo: 'http://www.worldsnooker.com/wp-content/uploads/2015/12/IMG_62961.jpg'
    },
    // Akani Songsermsawad
    1763: <IPlayer>{

        photo: 'http://bsfi.net/wp-content/uploads/2017/09/akani2.jpg'
    }
};

export const PLAYER_CONFIG = new InjectionToken(

    'config', { providedIn: 'root', factory: () => configuration }
);

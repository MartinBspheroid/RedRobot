//@ts-check
loadAPI(16);

// Remove this if you want to be able to use deprecated methods without causing script to stop.
// This is useful during development.
host.setShouldFailOnDeprecatedUse(true);

function makeIndexedFunction(index, f) {
   return function (value) {
      f(index, value);
   }
}

const log = host.println
const MAX_TRACKS = 100;
var NUM_SCENES = 100;

host.defineController("SentinelAgency", "RedRobot", "0.1", "d6a28869-a23d-46ac-a830-52be7c79e8ff", "sphere42");

let deviceBank, cursorDevice, transport, cursorTrack;
let app;
let dev;
let basePath = "C:\\Program Files\\Bitwig Studio\\4.2.2\\Library\\devices\\";
let MassiveBasePath = "C:\\Users\\john\\Documents\\Bitwig Studio\\Library\\Presets\\Massive\\"
let clips;
let trackBank
function init() {


   app = host.createApplication()
   host.scheduleTask(run, 10);

   cursorTrack = host.createCursorTrack('Selected Track', 'Selected Track', 1, 1, true);
   clips = cursorTrack.clipLauncherSlotBank();

   trackBank = host.createTrackBank(MAX_TRACKS, 0, NUM_SCENES, true);
   for (let i = 0; i < MAX_TRACKS; i++) {
      const replaceStot = trackBank.getItemAt(i).createDeviceBank(1).getItemAt(0).replaceDeviceInsertionPoint();
      var clipNames = [];
      var track = trackBank.getItemAt(i);
      track.subscribe();
      const clips = track.clipLauncherSlotBank()
      clips.addPlaybackStateObserver((index, playback, isQueued) => {
         if (playback == 1 && isQueued == true) {
            log("playback: " + clipNames[index] + " " + playback + " " + isQueued);
            replaceStot.insertFile(MassiveBasePath + clipNames[index] + ".bwpreset");
         }
      });
      clips.addNameObserver((index, name) => {
         clipNames[index] = name;
      });
   }




   cursorDevice = cursorTrack.createCursorDevice("Selected Device", "Selected Device", 0, CursorDeviceFollowMode.FIRST_INSTRUMENT);
   deviceBank = cursorTrack.createDeviceBank(8);
   dev = deviceBank.getDevice(0);

}
function run() {
   dev.replaceDeviceInsertionPoint().insertFile(basePath + "Polymer.bwdevice");


}


function flush() {



   // TODO: Flush any output to your controller here.
}

function exit() {

}
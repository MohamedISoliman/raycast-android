import { ActionPanel, Detail, List, Action, PreferenceValues, showToast, Toast, popToRoot, Icon } from "@raycast/api";
import { getPreferenceValues } from "@raycast/api";
import { useState, useEffect } from "react";
import { PathLike, readdir } from "fs";
import { homedir } from "os";
import { getApplications } from "@raycast/api";
const { exec } = require('child_process');


export default function Command() {

  const [items, setItems] = useState<string[]>(() => [])
  const [loading, setLoading] = useState(true)

  const preferences: PreferenceValues = getPreferenceValues();
  const projectsDirectory = preferences.ANDROID_DIRECTORY;

  loadDirectories(projectsDirectory, setItems, setLoading);

  const icon1 = "https://img.icons8.com/fluency/344/android-studio--v2.png"

  return (
    <List isLoading={loading}>
      {
        items?.map((project: string, index) => (

          <List.Item
            icon={{ source: icon1 }}//TODO: load app icon
            key={index}
            title={project}
            accessories={[
              { icon: Icon.Folder },
            ]}
            actions={<ActionPanel>

              <Action title="Open Project" onAction={() => openProject(projectsDirectory, project)} />

            </ActionPanel>}
          />
        ))
      }
    </List>);
}


function loadDirectories(projectsDirectory: any, setItems, setLoading) {
  getDirectories(projectsDirectory, async (files: string[]) => {
    await delay(2000); //fake loading

    setItems(files);
    // files.forEach(element => {
    //   console.log(projectsDirectory + '/' + element)
    // });
    setLoading(false);
    showToast(Toast.Style.Success, "Loaded!");

  }, function (err: NodeJS.ErrnoException) {
    showToast(Toast.Style.Failure, "Something wrong happed!", err.message);
    setLoading(false);
  });
}

function openProject(projectsDirectory: any, project: string): void {
  return exec(`open -na Android\\ Studio.app --args ${projectsDirectory}/${project}`,
    (err, stdout, stderr) => {
      console.log(err);
      console.log(stdout);
      console.log(stderr);
      popToRoot;
    });
}

async function getDirectories(
  source: PathLike,
  onSuccess: (directories: string[]) => string[],
  onError: (err: NodeJS.ErrnoException) => void
) {
  return readdir(source, { withFileTypes: true }, (err, files) => {
    if (err) {
      onError(err);
    } else {
      const directories = files.filter((dirent) => dirent.isDirectory()).map((dirent) => dirent.name);
      onSuccess(directories);
    }
  });
}


export async function isAndroidStudioInstalled() {
  return (await getApplications()).find((app) => {
    console.log(app)
    app.name === "Android studio" != undefined ? true : false;
  })
}


function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
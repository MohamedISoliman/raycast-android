import { ActionPanel, Detail, List, Action, PreferenceValues, showToast, Toast, popToRoot } from "@raycast/api";
import { getPreferenceValues } from "@raycast/api";
import { useState, useEffect } from "react";
import { PathLike, readdir } from "fs";


export default function Command() {

  const [items, setItems] = useState<string[]>(() => [])
  const [loading, setLoading] = useState(true)

  const preferences: PreferenceValues = getPreferenceValues<PreferenceValues>();
  const projectsDirectory = preferences.ANDROID_DIRECTORY;


  getDirectories(projectsDirectory, async (files: string[]) => {
    await delay(2000)//fake loading
    setItems(files)
    setLoading(false)

  }, function (err: NodeJS.ErrnoException) {
    showToast(Toast.Style.Failure, "Something wrong happed!", err.message)
    setLoading(false)
  });

  return (
    <List isLoading={loading}>
      {
        items?.map((project, index) => (
          <List.Item key={index} title={project} />
        ))
      }
    </List>);
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


function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
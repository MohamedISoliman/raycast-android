import { ActionPanel, Detail, List, Action, PreferenceValues, showToast, Toast, popToRoot, Icon } from "@raycast/api";
import { getPreferenceValues } from "@raycast/api";
import { useState, useEffect } from "react";
import { PathLike, readdir } from "fs";
import { getApplications } from "@raycast/api";
const { exec } = require('child_process');
import { environment } from "@raycast/api";

import fs from 'fs';


export default function Command() {

  const [items, setItems] = useState<string[]>(() => [])
  const [loading, setLoading] = useState(true)

  const preferences: PreferenceValues = getPreferenceValues();
  const projectsDirectory = preferences.ANDROID_DIRECTORY;

  useEffect(() => {

    async function listDir() {

      exec(`emulator -list-avds`, (err: string, stdout: string, stderr: string) => {
        console.log(err);
        console.log(stdout);
        console.log(stderr);

        //error
        if (err != null) {
          showToast(Toast.Style.Failure, "Make sure you have `emulator` command available globally")
        }

        //Success
        if (stdout != null) {
          const avds = stdout.split("\n").filter((p: string) => p.trim());
          setItems(avds)
        }

        setLoading(false)
      })

    }

    listDir()

  }, [])

  return (
    <List isLoading={loading}>
      {
        items?.map((emulator: string, index) => (

          <List.Item
            icon={{ source: "android-emulator.png" }}
            key={index}
            title={emulator}
            accessories={[
              { icon: Icon.Mobile },
            ]}
            actions={<ActionPanel>

              <Action title="Open Emulator" onAction={() => openEmultror(emulator)} />

            </ActionPanel>}
          />
        ))
      }
    </List>);
}

function openEmultror(emulator: string): void {
  exec(`emulator -avd ${emulator}`, (err: string, stdout: string, stderr: string) => {
    console.log(err);
    console.log(stdout);
    console.log(stderr);

    if (stderr != null) {
      showToast(Toast.Style.Failure, stderr)
    }
    popToRoot
  })
}

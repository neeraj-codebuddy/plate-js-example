import React, { useState, useEffect } from "react";
import { Plate, PlateProps } from "@udecode/plate";
import { MarkBalloonToolbar } from "./balloon-toolbar/MarkBalloonToolbar";
import { BasicElementToolbarButtons } from "./basic-elements/BasicElementToolbarButtons";
import { BasicMarkToolbarButtons } from "./basic-marks/BasicMarkToolbarButtons";
import { basicNodesPlugins } from "./basic-nodes/basicNodesPlugins";
import { Toolbar } from "./toolbar/Toolbar";
import { MyValue } from "./typescript/plateTypes";

const styles = {
  wrapper: {
    display: "flex",
    flexDirection: "column"
  }
};

const Editor = (props: PlateProps<MyValue>) => (
  <Plate {...props}>
    <MarkBalloonToolbar />
  </Plate>
);

const INSTANCE_COUNT = 20;

const request = (entity) =>
  fetch(`https://jsonplaceholder.typicode.com/${entity}`)
    .then((response) => response.json())
    .then((json) => json);

const entities = [
  { label: "comments", count: 100 },
  { label: "albums", count: 15 },
  { label: "todos", count: 100 },
  { label: "users", count: 5 }
];

const PlateEditor = () => {
  const [loading, setLoading] = useState(true);
  const [list, setList] = useState([
    {
      type: "paragraph",
      children: [{ text: "A line of text in a paragraph." }]
    }
  ]);

  useEffect(() => {
    const arr = [];
    const obj = [];

    const fetch = async () => {
      try {
        setLoading(true);

        entities.forEach((item) => {
          arr.push(request(item.label));
        });

        const tempArr = await Promise.all(arr);

        entities.forEach((item, index) => {
          let temp = tempArr[index].splice(0, item.count);

          temp.forEach((t, i) => {
            obj.push({
              type: "paragraph",
              children: [{ text: `${item.label} : ${i}` }]
            });
            Object.keys(t).forEach((o) => {
              obj.push({
                type: "paragraph",
                children: [
                  { text: `${o} : ${typeof t[o] !== "object" ? t[o] : "----"}` }
                ]
              });
            });
          });

          setList(() => Array.from({ length: INSTANCE_COUNT }, () => [...obj]));
        });
      } catch (err) {
        alert(err.message);
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetch();
  }, []);

  return (
    <>
      <Toolbar>
        <BasicElementToolbarButtons />
        <BasicMarkToolbarButtons />
      </Toolbar>

      <div style={styles.wrapper}>
        {loading ? (
          <h4>loading...</h4>
        ) : (
          list.map((item, index) => (
            <Editor
              id="basic"
              key={index}
              plugins={basicNodesPlugins}
              initialValue={item}
            />
          ))
        )}
      </div>
    </>
  );
};
export default PlateEditor;

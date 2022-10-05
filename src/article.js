import { db } from "./firebaseData";
import styled from "styled-components";
import ReactLoading from "react-loading";
import {
  collection,
  getDocs,
  onSnapshot,
  doc,
  setDoc,
} from "firebase/firestore";
import { useState, useRef, useEffect } from "react";

const Wrapper = styled.div`
  padding: 130px 5%;
  display: flex;
  flex-direction: column;
`;

const Separator = styled.div`
  margin: 0 auto;
  width: 70%;
  max-width: 800px;
  & ~ & {
    margin-top: 20px;
  }
`;

const Text = styled.div`
  height: 40px;
  font-size: 20px;
`;

const InputValue = styled.input`
  margin: auto;
  padding: 10px 20px;
  width: 100%;
  height: ${(props) => props.height || "44px"};
  color: lightgray;
  font-size: 16px;
  background-color: rgb(240, 240, 240, 0.05);
  border: 1px solid gray;
  &:hover {
    border: 2px solid lightblue;
    border-radius: 5px;
  }
  &:focus {
    outline: none !important;
    background-color: rgb(0, 0, 0, 0.1);
  }
`;

const SelectTag = styled.select`
  padding: 5px 20px;
  height: 40px;
  width: 100%;
  font-size: 16px;
  color: lightgray;
  background-color: rgb(240, 240, 240, 0.05);
  &:hover {
    cursor: pointer;
  }
  &:focus {
    outline: none !important;
  }
`;

const Post = styled.button`
  color: #313538;
  margin: 40px auto;
  height: 60px;
  width: 100%;
  font-size: 16px;
  background-color: #f9f0d2;
  border: 1px solid gray;
  &:hover {
    cursor: pointer;
    box-shadow: 1px 1px 3px gray;
  }
`;

const TextContent = styled.div`
  position: relative;
  padding: 20px 30px;
  background-color: rgb(240, 240, 240, 0.05);
  border: 1px solid #d4d4d4;
  & ~ & {
    margin-top: 10px;
  }
  &:hover {
    border: 2px solid lightblue;
  }
`;

const DataText = styled.div`
  color: ${(props) => props.color || "lightgray"};
  background-color: rgb(240, 240, 240, 0);
  font-size: ${(props) => props.size || "14px"};
  & ~ & {
    margin-top: 5px;
  }
`;

const Content = styled.textarea`
  width: 100%;
  font-size: 14px;
  color: lightgray;
  border: none;
  background-color: rgb(240, 240, 240, 0);
`;

const Tag = styled.div`
  top: 20px;
  right: 20px;
  padding: 2px 5px;
  color: lightblue;
  position: absolute;
  border: 1px solid darkgrey;
  background-color: rgb(240, 240, 240, 0.05);
`;

const Loading = styled(ReactLoading)`
  margin: 0 auto;
`;

function PullData(props) {
  const { id, author_id, title, content, tag, created_time } = props.data;
  return (
    <TextContent>
      <DataText color="#f9f0d2" size="20px">{`Title : ${title}`}</DataText>
      <DataText>{`Author  : ${author_id}`}</DataText>
      <Tag>{tag}</Tag>
      <DataText>Content :</DataText>
      <Content value={content} />
      <DataText
        color="gray"
        size="12px"
      >{`Created Time : ${created_time}`}</DataText>
    </TextContent>
  );
}

function Articles() {
  const [isLoading, setIsLoading] = useState(false);
  const tag = ["Beauty", "Gossiping", "SchoolLife"];
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [data, setData] = useState([]);
  const selectedRef = useRef(tag[0]);

  useEffect(() => {
    setIsLoading(true);
    const clientData = collection(db, "Articles");
    const clean = onSnapshot(clientData, (querySnapshot) => {
      let newData = [];
      querySnapshot.forEach((doc) => {
        newData.push({
          id: doc.id,
          author_id: doc.data().author_id,
          title: doc.data().title,
          content: doc.data().content,
          tag: doc.data().tag,
          created_time: doc.data().created_time.toDate(),
        });
      });
      setIsLoading(false);
      setData(newData);
    });
    return () => {
      clean();
    };
  }, []);

  async function firebaseDataHandler() {
    try {
      const docRef = doc(collection(db, "Articles"));
      await setDoc(docRef, {
        id: docRef.id,
        author_id: "Aliyah",
        title: `${title}`,
        content: `${content}`,
        tag: `${selectedRef.current.value}`,
        created_time: new Date(),
      });

      const querySnapshot = await getDocs(collection(db, "Articles"));
      querySnapshot.forEach((doc) => {
        console.log(`
        ~~~~ push to firebase ~~~~
        id: ${doc.id}
        author_id: ${doc.data().author_id}
        title: ${doc.data().title}
        content: ${doc.data().content}
        tag: ${doc.data().tag}
        created_time: ${doc.data().created_time.toDate()}
        `);
      });
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  }

  return (
    <Wrapper>
      <Separator>
        <Text>Title</Text>
        <InputValue
          value={title}
          placeholder="來點今天的心情吧！"
          onChange={(e) => setTitle(e.target.value)}
        />
      </Separator>
      <Separator>
        <Text>Content</Text>
        <InputValue
          as="textarea"
          height="200px"
          value={content}
          placeholder="有什麼想說的嗎～"
          onChange={(e) => setContent(e.target.value)}
        />
      </Separator>
      <Separator>
        <Text style={{ width: "60px" }}>Tag</Text>
        <SelectTag
          ref={selectedRef}
          onChange={(e) => {
            selectedRef.current.value = e.target.value;
          }}
        >
          {tag.map((string, index) => {
            return <option key={`${index + 1}`}>{string}</option>;
          })}
        </SelectTag>
        <Post onClick={() => firebaseDataHandler()}>Post</Post>
      </Separator>

      {isLoading ? (
        <Loading />
      ) : (
        <Separator>
          <Text>文章列表</Text>
          {data.map((doc, index) => {
            return <PullData data={doc} key={`${index + 1}`} />;
          })}
        </Separator>
      )}
    </Wrapper>
  );
}

export default Articles;

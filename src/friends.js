import { db } from "./firebaseData";
import styled from "styled-components";
import ReactLoading from "react-loading";
import {
  collection,
  onSnapshot,
  query,
  where,
  getDocs,
  setDoc,
  doc,
  deleteDoc,
} from "firebase/firestore";
import { useState, useEffect } from "react";

const myId = "f5pge8v74USLWWcQpoWz";
const myName = "Aliyah";
const myEmail = "aaa@gmail.com";

const Wrapper = styled.div`
  padding: 130px 5%;
  display: flex;
  flex-direction: column;
`;

const Separator = styled.div`
  position: relative;
  margin: 20px auto;
  width: 70%;
  max-width: 800px;
`;

const Title = styled.div`
  margin-bottom: 10px;
  font-size: 18px;
  color: white;
`;

const SearchInput = styled.input`
  height: 40px;
  width: 100%;
  border-radius: 5px;
  padding: 6px 45px 6px 20px;
  border: solid 1px #d4d4d4;
  font-size: 16px;
  line-height: 24px;
  color: lightgray;
  background-color: rgb(240, 240, 240, 0.1);
  &:focus {
    outline: none !important;
    background-color: rgb(0, 0, 0, 0.1);
  }
`;

const FriendListContainer = styled.div`
  padding: 20px 30px;
  height: 100%;
  position: relative;
  border: 1px solid #d4d4d4;
  background-color: rgb(240, 240, 240, 0.05);
  & + & {
    margin-top: 30px;
  }
`;

const FriendDtl = styled.div`
  color: ${(props) => props.color || "lightgray"};
  font-size: ${(props) => props.size || "14px"};
  background-color: rgb(240, 240, 240, 0);
  & + & {
    margin-top: 5px;
  }
`;

const SendRequest = styled.button`
  top: 30%;
  right: ${(props) => props.right || "20px"};
  position: absolute;
  height: 40%;
  font-size: 14px;
  background-color: rgb(240, 240, 240, 0.1);
  border: 1px solid gray;
  &:hover {
    box-shadow: 1px 1px 3px gray;
  }
`;

const Loading = styled(ReactLoading)`
  margin: 0 auto;
`;

function FriendsList(props) {
  const { id, email, name } = props.data;
  const deleteFriend = async () => {
    const ans = window.confirm("真的要刪除好友嗎(☍﹏⁰)");
    if (ans === false) return;
    await deleteDoc(doc(db, `Users/${myId}/friend_list`, id));
    await deleteDoc(doc(db, `Users/${id}/friend_list`, myId));
  };
  return (
    <FriendListContainer>
      <FriendDtl color="#f9f0d2" size="20px">{`Name: ${name}`}</FriendDtl>
      <FriendDtl>{`Email: ${email}`}</FriendDtl>
      <FriendDtl>{`ID: ${id}`}</FriendDtl>
      <SendRequest onClick={deleteFriend}>刪除好友</SendRequest>
    </FriendListContainer>
  );
}

function ShowSearch({ setHasSearchValue, data, setInputValue }) {
  const { id, email, name } = data;
  const sendRequest = async () => {
    await setDoc(doc(db, `Users/${id}/friend_request`, myId), {
      id: myId,
      name: myName,
      email: myEmail,
    });
    alert("已送出好友申請");
    setInputValue("");
    setHasSearchValue(false);
  };

  return (
    <FriendListContainer>
      <FriendDtl color="lightblue" size="20px">{`Name: ${name}`}</FriendDtl>
      <FriendDtl>{`Email: ${email}`}</FriendDtl>
      <SendRequest onClick={sendRequest}>添加好友</SendRequest>
    </FriendListContainer>
  );
}

function ShowInvitation({ data }) {
  const { name, id, email } = data;
  const acceptRequest = async () => {
    await setDoc(doc(db, `Users/${id}/friend_list`, myId), {
      id: myId,
      name: myName,
      email: myEmail,
    });
    await setDoc(doc(db, `Users/${myId}/friend_list`, id), {
      id: `${id}`,
      name: `${name}`,
      email: `${email}`,
    });
    await deleteDoc(doc(db, `Users/${myId}/friend_request`, id));

    alert("你們現在是好友囉～");
  };

  const refuseRequest = async () => {
    const ans = window.confirm("真的要拒絕嗎( ´•̥̥̥ω•̥̥̥` )");
    if (ans === false) return;
    await deleteDoc(doc(db, `Users/${myId}/friend_request`, id));
  };

  return (
    <FriendListContainer>
      <FriendDtl color="#ffe8ec" size="20px">{`Name: ${name}`}</FriendDtl>
      <FriendDtl>{`Email: ${email}`}</FriendDtl>
      <FriendDtl>{`ID: ${id}`}</FriendDtl>
      <SendRequest onClick={acceptRequest} right="120px">
        同意申請
      </SendRequest>
      <SendRequest onClick={refuseRequest}>我拒絕！</SendRequest>
    </FriendListContainer>
  );
}

function Friends() {
  const [isLoading, setIsLoading] = useState(false);
  const [friends, setFriends] = useState([]);
  const [hasInvitation, setHasInvitation] = useState(false);
  const [friendRequests, setFriendRequests] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [hasSearchValue, setHasSearchValue] = useState(false);
  const [searchData, setSearchData] = useState({});

  const searchUser = async () => {
    const userData = collection(db, "Users");
    const q = query(userData, where("email", "==", inputValue));
    const querySnapshot = await getDocs(q);
    let data;
    querySnapshot.forEach((doc) => {
      data = {
        id: doc.data().id,
        email: doc.data().email,
        name: doc.data().name,
      };
    });
    if (!data) {
      alert("找不到使用者，請再重新輸入！");
      setHasSearchValue(false);
      return;
    }
    setHasSearchValue(true);
    setSearchData(data);
  };

  useEffect(() => {
    const clientData = collection(db, `Users/${myId}/friend_request`);
    const clean = onSnapshot(clientData, (querySnapshot) => {
      let newRequest = [];
      querySnapshot.forEach((doc) => {
        newRequest.push({
          id: doc.data().id,
          name: doc.data().name,
          email: doc.data().email,
        });
      });
      if (newRequest.length === 0) {
        setHasInvitation(false);
        setFriendRequests(newRequest);
        return;
      }
      setHasInvitation(true);
      setFriendRequests(newRequest);
    });
    return () => {
      clean();
    };
  }, []);

  useEffect(() => {
    setIsLoading(true);
    const clientData = collection(db, `Users/${myId}/friend_list`);
    const clean = onSnapshot(clientData, (querySnapshot) => {
      let userList = [];
      querySnapshot.forEach((doc) => {
        userList.push({
          id: doc.id,
          email: doc.data().email,
          name: doc.data().name,
        });
      });
      setFriends(userList);
      setIsLoading(false);
    });
    return () => {
      clean();
    };
  }, []);

  return (
    <Wrapper>
      <Separator>
        <SearchInput
          onKeyPress={(e) => {
            if (e.key === "Enter") {
              if (inputValue === myEmail) {
                alert("不能加自己好友喔！");
                setInputValue("");
                return;
              }
              let storedMail = friends.some(
                (email) => inputValue === email.email
              );
              if (storedMail) {
                alert("你們已經是好友囉！");
                setInputValue("");
                return;
              }
              setSearchData("");
              setHasSearchValue(false);
              searchUser();
            }
          }}
          onChange={(e) => {
            setInputValue(e.target.value);
          }}
          placeholder="搜尋好友"
          value={inputValue}
        />
      </Separator>
      {isLoading ? (
        <Loading />
      ) : (
        <>
          {hasSearchValue ? (
            <Separator>
              <ShowSearch
                data={searchData}
                setHasSearchValue={setHasSearchValue}
                setInputValue={setInputValue}
              />
            </Separator>
          ) : (
            ""
          )}

          {hasInvitation ? (
            <Separator>
              <Title>好友申請</Title>
              {friendRequests.map((requesData, requesIndex) => {
                return (
                  <ShowInvitation
                    data={requesData}
                    key={`${requesIndex + 1}`}
                  />
                );
              })}
            </Separator>
          ) : (
            ""
          )}
          {friends.length !== 0 ? (
            <Separator>
              <Title>好友列表</Title>
              {friends.map((data, index) => {
                return <FriendsList data={data} key={`${index + 1}`} />;
              })}
            </Separator>
          ) : (
            <Separator>
              <Title style={{ fontSize: "30px" }}>
                還沒有好友喔～快去搜尋看看吧！
              </Title>
            </Separator>
          )}
        </>
      )}
    </Wrapper>
  );
}

export default Friends;

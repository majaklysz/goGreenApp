import DailyListCom from "../../assets/components/dailylist/DailyListCom";
import { getAuth } from "firebase/auth";
import "./dailylist.css";
export default function DailyListPage() {
  const auth = getAuth();
  const user = auth.currentUser ? { uid: auth.currentUser.uid } : null;

  return (
    <section>
      <h1 className="headlineDaily">Daily List</h1>
      <div>
        <DailyListCom user={user} />
      </div>
    </section>
  );
}

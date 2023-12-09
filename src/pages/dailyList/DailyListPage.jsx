import DailyListCom from "../../assets/components/dailylist/DailyListCom";
import { getAuth } from "firebase/auth";

export default function DailyListPage() {
  const auth = getAuth();
  const user = auth.currentUser ? { uid: auth.currentUser.uid } : null;

  return (
    <section>
      <h2>Daily List</h2>
      <DailyListCom user={user} />
    </section>
  );
}

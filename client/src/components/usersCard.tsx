import { MainStateType } from "./mainState";
import { CardActionArea } from "@mui/material";
interface UsersCardPageProps {
  mainState: MainStateType;
  setMainState: (m: MainStateType) => void;
}
export function UserCard({ mainState, setMainState }: UsersCardPageProps) {
  const { allUsersProfiles } = mainState;

  return (
    <div className="container" style={{ marginTop: "5%", marginBottom: "5%" }}>
      <div className="row">
        {allUsersProfiles.map((use) => (
          <div className="col-md-4  pt-3 pb-3">
            <CardActionArea
              onClick={() => {
                mainState.render = "userProductCard";
                mainState.userProfile = use;
                mainState.selectedUser = use;
                setMainState({ ...mainState });
              }}
            >
              <div className="card text-center">
                <img
                  src={use.logo}
                  className="card-img-top"
                  alt="..."
                  width="100"
                  height="200"
                />

                <div className="card-footer text-muted">
                  {mainState.language === "EN"
                    ? use.publishednameen
                    : use.publishednamear}
                </div>
              </div>
            </CardActionArea>
          </div>
        ))}
      </div>
    </div>
  );
}

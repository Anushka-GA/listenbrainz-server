import * as React from "react";
import { includes as _includes } from "lodash";

import Pill from "../components/Pill";
import UserListModalEntry from "./UserListModalEntry";
import GlobalAppContext from "../utils/GlobalAppContext";

export type FollowerFollowingModalProps = {
  user: ListenBrainzUser;
  followerList: Array<string>;
  followingList: Array<string>;
  loggedInUserFollowsUser: (user: ListenBrainzUser | SimilarUser) => boolean;
  updateFollowingList: (
    user: ListenBrainzUser,
    action: "follow" | "unfollow"
  ) => void;
};

type FollowerFollowingModalState = {
  activeMode: "follower" | "following";
};

export default class FollowerFollowingModal extends React.Component<
  FollowerFollowingModalProps,
  FollowerFollowingModalState
> {
  static contextType = GlobalAppContext;
  declare context: React.ContextType<typeof GlobalAppContext>;

  constructor(props: FollowerFollowingModalProps) {
    super(props);
    this.state = {
      activeMode: "follower",
    };
  }

  updateMode = (mode: "follower" | "following") => {
    this.setState({ activeMode: mode });
  };

  render() {
    const {
      loggedInUserFollowsUser,
      updateFollowingList,
      followerList,
      followingList,
      user,
    } = this.props;
    const { activeMode } = this.state;
    const { currentUser } = this.context;

    const activeModeList =
      activeMode === "follower" ? followerList : followingList;
    return (
      <>
        <div className="text-center follower-following-pills">
          <div className="btn-group btn-group-justified" role="group">
            <Pill
              style={{ margin: "0px 6px" }}
              active={activeMode === "follower"}
              type="secondary"
              onClick={() => this.updateMode("follower")}
            >
              Followers ({followerList.length})
            </Pill>
            <Pill
              style={{ margin: "0px 6px" }}
              active={activeMode === "following"}
              type="secondary"
              onClick={() => this.updateMode("following")}
            >
              Following ({followingList.length})
            </Pill>
          </div>
        </div>

        {activeModeList.length === 0 ? (
          <>
            <hr style={{ margin: "0px 2em", borderTop: "1px solid #eee" }} />
            {activeMode === "follower" ? (
              <div className="follower-following-empty text-center text-muted">
                {user.name === currentUser?.name
                  ? "You don't"
                  : `${user.name} doesn't`}{" "}
                have any followers.
              </div>
            ) : (
              <div className="follower-following-empty text-center text-muted">
                {user.name === currentUser?.name
                  ? "You aren't"
                  : `${user.name} isn't`}{" "}
                following anyone.
              </div>
            )}
          </>
        ) : (
          <div className="follower-following-list">
            {activeModeList.map((listEntry: string) => {
              const formattedAsUser: ListenBrainzUser = {
                name: listEntry,
              };
              return (
                <UserListModalEntry
                  mode="follow-following"
                  key={listEntry}
                  user={formattedAsUser}
                  loggedInUserFollowsUser={loggedInUserFollowsUser(
                    formattedAsUser
                  )}
                  updateFollowingList={updateFollowingList}
                />
              );
            })}
          </div>
        )}
      </>
    );
  }
}

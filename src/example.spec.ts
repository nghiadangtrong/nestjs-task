class FriendsList {
    friends = [];

    addFriend (name) {
        this.friends.push(name);
        this.announceFriendShip(name);
    }

    removeFriend(name) {
        let idx = this.friends.indexOf(name);

        if(idx === -1) {
            throw new Error(`${name} not exits`);
        }

        this.friends.splice(idx, 1);
    }

    announceFriendShip(name) {
        global.console.log(`${name} is now friend`);
    }
}

describe("FriendsList", () => {
    let friendsList;

    beforeEach(() => {
        friendsList = new FriendsList();
    })

    it('initial friends list', () => {
        expect(friendsList.friends.length).toEqual(0);
    })

    it('adds friend to list', () => {
        friendsList.addFriend('noan');
        expect(friendsList.friends.length).toEqual(1);
    })

    it('function announceFriendShip đã được gọi vào', () => {
        friendsList.announceFriendShip = jest.fn();
        expect(friendsList.announceFriendShip).not.toHaveBeenCalled();
        friendsList.addFriend('noan');
        expect(friendsList.announceFriendShip).toHaveBeenCalled();
    })

    describe('Remove friends', () => {
        it('remove friend success', () => {
            friendsList.addFriend('noan');
            expect(friendsList.friends[0]).toEqual('noan');
            friendsList.removeFriend('noan');
            expect(friendsList.friends.length).toEqual(0);
        })

        it('throw error remove', () => {
            let name = 'noan';
            expect(()=> friendsList.removeFriend(name)).toThrow(new Error(`${name} not exits`));
        })
    })
}) 
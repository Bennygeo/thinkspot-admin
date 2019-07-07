import { AngularFireDatabase } from 'angularfire2/database';
import { Observable } from 'rxjs';
import { OnInit } from '@angular/core';

export class FireBase implements OnInit {

    itemValue = '';
    items: Observable<any[]>;
    database_obs: any;

    constructor(private db: AngularFireDatabase) {
    }

    ngOnInit(): void {

    }

    public readUsers() {
        return new Observable((observer) => {
            var ref = this.db.database.ref('/users');
            ref.on("value", function (snapshot) {
                observer.next(snapshot.exportVal());
            });
        });

        // let _data = this.db.database.ref('users').on("value", (data) => {
        //     debugger;
        // });

    }

    public writeUserMobileNumber(obj) {
        this.db.database.ref('/users/' + obj.id).update({
            mobile: obj.mobile
        }, (error) => {
            if (error) console.log("The write failed...");
            else console.log("Data saved successfully!")
        });
    }

    public writeUserAddress(obj, locId) {
        this.db.database.ref('/users/' + obj.id + '/address/').update({
            ['address' + locId]: JSON.stringify(obj.address)
        }, (error) => {
            if (error) console.log("The address write failed...");
            else console.log("Data saved successfully!")
        });
    }

    public adminWriteUserAddress(obj, callback) {
        this.db.database.ref('/users_info/' + obj.id).update({
            name: obj.name,
            ['/address/address' + 1]: JSON.stringify(obj.address),
            area: obj.area
        }, (error) => {
            if (error) callback("Write Failed.");
            else callback("Success");
        });
    }

    public writeUserBag(id, obj) {
        delete obj.undefined;
        this.db.database.ref('/users/' + id).update({
            userBag: JSON.stringify(obj)
        }, (error) => {
            if (error) console.log("The write failed...");
            else console.log("Data saved successfully!");
        });
    }

    public readAnIndividualUser(target, id) {
        return new Observable((observer) => {

            // const reader = new FileReader();
            // reader.onload = () => console.log("loading");
            // reader.onloadend = () => console.log("loaded");
            // debugger;
            var ref = this.db.database.ref('/' + target + '/' + id);
            ref.on("value", function (snapshot) {
                switch (target) {
                    case "users": {
                        observer.next(snapshot.exportVal());
                    }

                    case "products": {
                        observer.next(snapshot.exportVal());
                    }

                    case "orders": {
                        observer.next(snapshot.exportVal());
                    }

                    case "history": {
                        observer.next(snapshot.exportVal());
                    }

                    case "userBag": {
                        observer.next(snapshot.exportVal());
                    }

                    default:
                        console.log("default");
                        observer.error("Thinkspot :: error Firebase read request.");
                        break;
                }
            });
        });
    }

    deleteFromCart(target, user_id, product_id) {
        var ref = this.db.database.ref('/' + target + '/' + user_id);
        ref.on("value", (snapshot) => {

        })
    }

    public logout() {
        //logout
    }
}

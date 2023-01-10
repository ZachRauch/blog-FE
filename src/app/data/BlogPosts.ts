export class BlogPost {
    constructor(
        public id: number,
        public userId: number,
        public titleText: string,
        public bodyText: string,
        public datePosted: Date,
        public updateDate: Date
    ){}
}
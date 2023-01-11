export class Comment {
    constructor(
        public id: number,
        public userId: number,
        public postId: number,
        public comment: string
    ){}
}
/*
 * SPDX-License-Identifier: Apache-2.0
 */

import { Context, Contract, Info, Returns, Transaction } from 'fabric-contract-api';
import { MyAsset } from './my-asset';
import { MyAuth } from './my-asset';
import { MyUser } from './my-asset';

@Info({title: 'MyAssetContract', description: 'My Smart Contract' })
export class MyAssetContract extends Contract {

    @Transaction(false)
    @Returns('boolean')
    public async myAuthExists(ctx: Context, AssetId: string): Promise<boolean> {
        const data: Uint8Array = await ctx.stub.getState(AssetId);
        return (!!data && data.length > 0);
    }

    @Transaction(false)
    @Returns('boolean')
    public async myUserExists(ctx: Context, AssetId: string): Promise<boolean> {
        const data: Uint8Array = await ctx.stub.getState(AssetId);
        return (!!data && data.length > 0);
    }

    @Transaction(false)
    @Returns('boolean')
    public async myAssetExists(ctx: Context, AssetId: string): Promise<boolean> {
        const data: Uint8Array = await ctx.stub.getState(AssetId);
        return (!!data && data.length > 0);
    }

    @Transaction()
    public async grantAuth(ctx: Context, AuthCode: string, Type: string, forAssetId: string, 
        forUserId: string, Approval: string): Promise<void> {
        const exists: boolean = await this.myAssetExists(ctx, AuthCode);
        if (exists) {
            throw new Error(`The authorisation ${AuthCode} already exists`);
        } 

        const myAuth: MyAuth = new MyAuth();
        myAuth.AuthCode = AuthCode; 
        myAuth.Type = Type;
        myAuth.ForAssetId = forAssetId;
        myAuth.ForUserId = forUserId;
        myAuth.Approval = Approval; 
 
        const buffer: Buffer = Buffer.from(JSON.stringify(myAuth));
        await ctx.stub.putState(AuthCode, buffer);
        const eventPayload: Buffer = Buffer.from(`Created asset ${AuthCode}(${Approval})`);
        ctx.stub.setEvent('myEvent', eventPayload);
    }

    @Transaction()
    public async createMyUser(ctx: Context, UserId: string, Type: string,  
        Username: string, Date: string): Promise<void> {
        const exists: boolean = await this.myUserExists(ctx, UserId);
        if (exists) {
            throw new Error(`The asset ${UserId} already exists`);
        }
        const myUser: MyUser = new MyUser();
        myUser.UserId = UserId;
        myUser.Type = Type;
        myUser.Username = Username;
        myUser.Date = Date;        
        const buffer: Buffer = Buffer.from(JSON.stringify(myUser));
        await ctx.stub.putState(UserId, buffer);
        const eventPayload: Buffer = Buffer.from(`Created asset ${UserId}(${Username})`);
        ctx.stub.setEvent('myEvent', eventPayload);
    }

    @Transaction()
    public async createMyAsset(ctx: Context, AssetId: string, Type: string, ID: string, DateIssue: string, 
        DrNo: string, Group: string, Location: string, FrDate: string, ToDate: string, 
        MCStatus: string): Promise<void> {
        const exists: boolean = await this.myAssetExists(ctx, AssetId);
        if (exists) {
            throw new Error(`The asset ${AssetId} already exists`);
        }
        const myAsset: MyAsset = new MyAsset();
        myAsset.ID = ID;
        myAsset.Type = Type;
        myAsset.DateIssue = DateIssue;
        myAsset.DrNo = DrNo; 
        myAsset.Group = Group; 
        myAsset.Location = Location; 
        myAsset.FrDate = FrDate; 
        myAsset.ToDate = ToDate; 
        myAsset.MCStatus = MCStatus; 
        const buffer: Buffer = Buffer.from(JSON.stringify(myAsset));
        await ctx.stub.putState(AssetId, buffer);
        const eventPayload: Buffer = Buffer.from(`Created asset ${AssetId}(${Type})`);
        ctx.stub.setEvent('myEvent', eventPayload);
    }

    @Transaction(false)
    @Returns('MyAuth')
    public async readMyAuth(ctx: Context, AuthCode: string): Promise<MyAuth> {
        const exists: boolean = await this.myAuthExists(ctx, AuthCode);
        if (!exists) {
            throw new Error(`The authorisation ${AuthCode} does not exist`);
        }
        const data: Uint8Array = await ctx.stub.getState(AuthCode);
        const myAuth: MyAuth = JSON.parse(data.toString()) as MyAuth;
        return myAuth;
    }

    @Transaction(false)
    @Returns('MyUser')
    public async readMyUser(ctx: Context, UserId: string): Promise<MyUser> {
        const exists: boolean = await this.myAssetExists(ctx, UserId);
        if (!exists) {
            throw new Error(`The user ${UserId} does not exist`);
        }
        const data: Uint8Array = await ctx.stub.getState(UserId);
        const myUser: MyUser = JSON.parse(data.toString()) as MyUser;
        return myUser;
    }

    @Transaction(false)
    @Returns('MyAsset')
    public async getAsset(ctx: Context, AssetId: string): Promise<MyAsset> {
        const exists: boolean = await this.myAssetExists(ctx, AssetId);
        if (!exists) {
            throw new Error(`The asset ${AssetId} does not exist`);
        }

        const data: Uint8Array = await ctx.stub.getState(AssetId);
        const myAsset: MyAsset = JSON.parse(data.toString()) as MyAsset;
        return myAsset;
    }    

    @Transaction(false)
    @Returns('MyAsset')
    public async readMyAsset(ctx: Context, AssetId: string, UserId: string, AuthCode: string): Promise<MyAsset> {
        const exists: boolean = await this.myAssetExists(ctx, AssetId);
        if (!exists) {
            throw new Error(`The asset ${AssetId} does not exist`);
        }
        const exist1: boolean = await this.myUserExists(ctx, AssetId);
        if (!exist1) {
            throw new Error(`The user ${UserId} does not exist`);
        }
        const exist2: boolean = await this.myAuthExists(ctx, AuthCode);
        if (!exist2) {
            throw new Error(`The authorisation code ${AuthCode} does not exist`);
        }
        const forUserId: string = (await this.readMyAuth(ctx, AuthCode)).ForUserId;
        if (UserId !== forUserId) {
               throw new Error(`Sorry user ${UserId} is not authorise to this information`);
        }
        const myApproval: string = (await this.readMyAuth(ctx, AuthCode)).Approval;
        if (myApproval == 'N') {
               throw new Error(`Sorry user ${UserId} is not authorise to this information`);
        }

        const data: Uint8Array = await ctx.stub.getState(AssetId);
        const myAsset: MyAsset = JSON.parse(data.toString()) as MyAsset;
        return myAsset;
    }

    @Transaction()
    public async updateMyAuth(ctx: Context, AuthCode: string, Type: string, forAssetId: string, 
        forUserId: string, Approval: string): Promise<void> {
        const exists: boolean = await this.myAuthExists(ctx, AuthCode);
        if (!exists) {
            throw new Error(`The authorisation ${AuthCode} does not exist`);
        }


        const myAuth: MyAuth = new MyAuth(); 
        myAuth.AuthCode = AuthCode; 
        myAuth.Type = Type;
        myAuth.ForAssetId = forAssetId;
        myAuth.ForUserId = forUserId; 
        myAuth.Approval = Approval; 
    
        const buffer: Buffer = Buffer.from(JSON.stringify(myAuth));
        await ctx.stub.putState(AuthCode, buffer);
    }

    @Transaction()
    public async updateMyUser(ctx: Context, UserId: string, Type: string, Username: string, 
        Date: string): Promise<void> {
        const exists: boolean = await this.myAssetExists(ctx, UserId);
        if (!exists) {
            throw new Error(`The asset ${UserId} does not exist`);
        }
        const myUser: MyUser = new MyUser();
        myUser.UserId = UserId;
        myUser.Type = Type;
        myUser.Username = Username;
        myUser.Date = Date; 
        const buffer: Buffer = Buffer.from(JSON.stringify(myUser));
        await ctx.stub.putState(UserId, buffer);
    }

    @Transaction()
    public async updateMyAsset(ctx: Context, AssetId: string, Type: string, ID: string, DateIssue: string, 
        DrNo: string, Group: string, Location: string, FrDate: string, ToDate: string, 
        MCStatus: string): Promise<void> {
        const exists: boolean = await this.myAssetExists(ctx, AssetId);
        if (!exists) {
            throw new Error(`The asset ${AssetId} does not exist`);
        }
        const myAsset: MyAsset = new MyAsset();
        myAsset.ID = ID;
        myAsset.Type = Type;
        myAsset.DateIssue = DateIssue;
        myAsset.DrNo = DrNo; 
        myAsset.Group = Group; 
        myAsset.Location = Location; 
        myAsset.FrDate = FrDate; 
        myAsset.ToDate = ToDate; 
        myAsset.MCStatus = MCStatus; 
        const buffer: Buffer = Buffer.from(JSON.stringify(myAsset));
        await ctx.stub.putState(AssetId, buffer);
    }

    @Transaction(false)
    public async queryAllAssets(ctx: Context): Promise<string> {
        const startKey = '000';
        const endKey = '999';
        const iterator = await ctx.stub.getStateByRange(startKey, endKey);
        const allResults = [];
        while (true) {
            const res = await iterator.next();
            if (res.value && res.value.value.toString()) {
                console.log(res.value.value.toString());
                const Key = res.value.key;
                let Record;
                try {
                    Record = JSON.parse(res.value.value.toString());
                } catch (err) {
                    console.log(err);
                    Record = res.value.value.toString();
                }
                allResults.push({ Key, Record });
            }
            if (res.done) {
                console.log('end of data');
                await iterator.close();
                console.info(allResults);
                return JSON.stringify(allResults);
            }
        }
    }
   
    @Transaction()
    public async deleteMyAsset(ctx: Context, AssetId: string): Promise<void> {
        const exists: boolean = await this.myAssetExists(ctx, AssetId);
        if (!exists) {
            throw new Error(`The my asset ${AssetId} does not exist`);
        }
        await ctx.stub.deleteState(AssetId);
    }

}

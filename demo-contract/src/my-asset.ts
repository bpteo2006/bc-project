/*
 * SPDX-License-Identifier: Apache-2.0
 */

import { Object, Property } from 'fabric-contract-api';

@Object()
export class MyAsset {

    @Property()
    public Type: string;
    public ID: string;
    public DateIssue: string;
    public DrNo: string;
    public Group: string;
    public Location: string;
    public FrDate: string;    
    public ToDate: string;
    public MCStatus: string;
 
}

@Object()
export class MyUser {

    @Property()
    public UserId: string;
    public Type: string;
    public Username: string;
    public Date: string;
 
}

@Object()
export class MyAuth {

    @Property()
    public AuthCode: string;
    public Type: string;    
    public ForAssetId: string;
    public ForUserId: string;
    public Approval: string;  
}


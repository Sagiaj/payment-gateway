import { v4 as uuid } from "uuid";
import { injectDeep } from "../../../utilities/object-utility";
import { IAuthorizationRequest, IAuthorizationResponse } from "../../contracts/authorization";
import { AuthorizationRequest, AuthorizationResponse } from "../abstract-authorization";

export class RiskAssessmntData {
  traExmptn: string = "";
  delgtdAthntctn: string = "";
  trustdMerchntExmptn: string = "";
  scpExmptn: string = "";
  lowVlExmptn: string = "";
}

export class MsgIdentfctn {
  correlatnId: string = uuid();
  origId: string = "";
}

export class TracData {
  Val: string = "";
  Tp: string = "";
}

export class Hdr {
  TracData: TracData = new TracData();
}

export class AddtlSvc {
  Tp: string = "";
}

export class TxId {
  LocalDateTime: string = new Date().toISOString();
}

export class AddtlData {
  Val: string = "";
  Tp: string = "";
}

export class Dtls {
  Val: string = "";
  Nm: string = "";
}

export class SpclPrgrmmQlfctn {
  Dtls: Dtls = new Dtls();
}

export class TxAmt {
  Ccy: string = "";
  Amt: string = "";
}

export class TxAmts {
  TxAmt: TxAmt = new TxAmt();
}

export class Tx {
  AddtlSvc: AddtlSvc = new AddtlSvc();
  TxAttr: string = "";
  TxDesc: string = "";
  TxId: TxId = new TxId();
  AddtlData: AddtlData = new AddtlData();
  AltrnMsgRsn: string = "";
  SpclPrgrmmQlfctn: SpclPrgrmmQlfctn = new SpclPrgrmmQlfctn();
  TxAmts: TxAmts = new TxAmts();
}

export class Id {
  Id: string = "";
}

export class SpnsrdMrchnt {
  Id: Id = new Id();
}

export class AddtlData2 {
  Val: string = "";
  Tp: string = "";
}

export class Adr {
  Ctry: string = "";
}

export class Accptr {
  AddtlId: string = "";
  CstmrSvc: string = "";
  SpnsrdMrchnt: SpnsrdMrchnt = new SpnsrdMrchnt();
  ShrtNm: string = "";
  AddtlData: AddtlData2 = new AddtlData2();
  Id: string = "";
  Adr: Adr = new Adr();
}

export class TermnlId {
  Id: string = "";
}

export class Termnl {
  TermnlId: TermnlId = new TermnlId();
}

export class Prvdr {
  Id: string = "";
}

export class Wllt {
  Prvdr: Prvdr = new Prvdr();
}

export class Card {
  XpryDt: string = "";
  PAN: string = "";
}

export class Envt {
  Accptr: Accptr = new Accptr();
  Termnl: Termnl = new Termnl();
  Wllt: Wllt = new Wllt();
  Card: Card = new Card();
}

export class Val {
  TxtVal: string = "";
}

export class VrfctnInf {
  Val: Val = new Val();
}

export class Vrfctn {
  VrfctnInf: VrfctnInf = new VrfctnInf();
  Tp: string = "";
}

export class TxCntxt {
  MrchntCtgyCd: number = 0;
  MrchntCtgySpcfcData: string = "";
}

export class SpclConds {
  Id: string = "";
}

export class EComrcData {
  Val: string = "";
  Tp: string = "";
}

export class PtOfSvcCntxt {
  MOTOInd: string = "";
  PrtlApprvlSpprtd: string = "";
  SpclConds: SpclConds = new SpclConds();
  CardDataNtryMd: string = "";
  EComrcData: EComrcData[];
}

export class RskInptData {
  Val: string = "";
  Tp: string = "";
}

export class RskAssmnt {
  RskAssmntTp: string = "";
  Rslt: string = "";
}

export class RskCntxt {
  RskInptData: RskInptData = new RskInptData();
  RskAssmnt: RskAssmnt = new RskAssmnt();
}

export class SaleCntxt {
  GoodsAndSvcsTp: string = "";
}

export class Cntxt {
  Vrfctn: Vrfctn[];
  TxCntxt: TxCntxt = new TxCntxt();
  PtOfSvcCntxt: PtOfSvcCntxt = new PtOfSvcCntxt();
  RskCntxt: RskCntxt = new RskCntxt();
  SaleCntxt: SaleCntxt = new SaleCntxt();
}

export class Body {
  Tx: Tx = new Tx();
  Envt: Envt = new Envt();
  Cntxt: Cntxt = new Cntxt();
}


export class AuthVoid {
  href: string = "";
}

export class AuthCapture {
  href: string = "";
}

export class Links {
  authVoid: AuthVoid = new AuthVoid();
  authCapture: AuthCapture = new AuthCapture();
}

export class Amt {
  Ccy: string = "";
  Amt: string = "";
}

export class AddtlAmts {
  Amt: Amt = new Amt();
  Tp: string = "";
}

export class VrfctnRslt {
  RsltDtls: string = "";
  Tp: string = "";
  Rslt: string = "";
}

export class Rcncltn {
  Dt: string = "";
}

export class AddtlRskData {
  Val: string = "";
  Tp: string = "";
}

export class AddtlRsltInf {
  Val: string = "";
  Tp: string = "";
}

export class RsltData {
  AddtlRsltInf: AddtlRsltInf[];
  RsltDtls: string = "";
  Rslt: string = "";
}

export class ApprvlData {
  ApprvlCd: string = "";
}

export class PrcgRslt {
  RsltData: RsltData = new RsltData();
  ApprvlData: ApprvlData = new ApprvlData();
}

export class VisaAuthorizationRequest extends AuthorizationRequest implements IAuthorizationRequest {
  riskAssessmntData: RiskAssessmntData = new RiskAssessmntData();
  msgIdentfctn: MsgIdentfctn = new MsgIdentfctn();
  Hdr: Hdr = new Hdr();
  Body: Body = new Body();

  constructor() {
    super();
    if (initConfig.current_env !== initConfig.environment_levels.PROD) {
      injectDeep(this, require("../../../../test-request.json"));
    }
  }

  parseFromRequest(correlation_id: string, params): VisaAuthorizationRequest {
    const method_name = "VisaAuthorizationRequest/parseFromRequest";
    AppLogger.info(correlation_id, `${method_name}`);
    if (initConfig.current_env === initConfig.environment_levels.PROD) {
      this.msgIdentfctn.correlatnId = correlation_id;
    }
    
    if (params) {
      this.Body.Envt.Card.PAN = params["card_details"]["number"] || "";
      this.Body.Envt.Card.XpryDt = `${params["card_details"]["expiration_month"]}${params["card_details"]["expiration_year"]}` || "";
      this.Body.Tx.TxAmts.TxAmt.Amt = params["amount"] || "";
      this.Body.Tx.TxAmts.TxAmt.Ccy = params["currency_code"] || "";
    }

    return this;
  }
}

export class VisaAuthorizationResponse extends AuthorizationResponse implements IAuthorizationResponse {
  riskAssessmntData: RiskAssessmntData = new RiskAssessmntData();
  msgIdentfctn: MsgIdentfctn = new MsgIdentfctn();
  _links: Links = new Links();
  Hdr: Hdr = new Hdr();
  Body: Body = new Body();

  parseFromResponse(correlation_id: string, data: any): VisaAuthorizationResponse {
    return this;
  }
}

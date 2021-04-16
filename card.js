function Card (id, number, type, youxian) {
  this.id = id; // 牌id
  this.number = number; // 牌点数
  this.type = type; // 牌类型（黑红梅方）
  this.youxian = youxian; // 点点大小
  this.ower = null; // 所属者
}

Card.prototype = {};

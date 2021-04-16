var cardType = [
  'yizhang',
  'liangzhang',
  'sanzhang',
  'sandaiyi',
  'sandaier',
  'feiji',
  'shunzi',
  'liandui',
  'zhadan',
  'sidai',
  'wangzha'
];

function Players (game, id, name, score) {
  this.game = game;
  this.id = id; // 玩家id
  this.name = name; // 玩家名字
  this.score = score; // 玩家分数
  this.cards = []; // 玩家手牌
  this.isDiZhu = false; // 是否地主
}

Players.prototype = {
  xuanzhong: function () {},
  chupai: function (list) {
    for (var i = this.cards.length - 1, result = []; i >=0; i--) {
      if (list.indexOf(i) !== -1) {
        result.push(this.cards[i]);
      }
    }
    // 校验规则
    for (var i = 0, t = false; i < cardType.length; i++) {
      t = (this[cardType[i]])(result);
      if (t) {
        console.log(t);
        break;
      }
    }
    if (!t) {
      console.log('不符合规则');
      return;
    }
    // 比大小
    if (this.game.bidaxiao(result, t)) {
      for (var i = this.cards.length - 1; i >=0; i--) {
        if (list.indexOf(i) !== -1) {
          this.cards.splice(i, 1);
        }
      }
      console.log(result);
      this.game.guo = result;
      this.game.guoType = t;
      this.game.computeActive();
    }
  },
  buchu: function () {
    if (!this.game.guo.length) {
      return;
    }
    if (this.game.guo[0].ower == this.game.activeId) {
      return;
    }
    this.game.computeActive();
  },

  yizhang: function (cards) {
    return cards.length == 1 ? 'yizhang' : false;
  },
  liangzhang: function (cards) {
    return (cards.length == 2 && cards[0].number == cards[1].number) ? 'liangzhang' : false;
  },
  sanzhang: function (cards) {
    if (cards.length == 3) {
      if (cards[0].number == cards[1].number) {
        if (cards[1].number == cards[2].number) {
          return 'sanzhang';
        }
      }
    }
    return false;
  },
  sandaiyi: function (cards) {
    if (cards.length == 4 && !this.zhadan(cards)) {
      if (this.sanzhang(cards.slice(0, 3))) {
        return 'sandaiyi';
      }
      if (this.sanzhang(cards.slice(1))) {
        cards.reverse();
        return 'sandaiyi';
      }
    }
    return false;
  },
  sandaier: function (cards) {
    if (cards.length == 5) {
      if (this.sanzhang(cards.slice(0, 3)) && this.liangzhang(cards.slice(3))) {
        return 'sandaier';
      }
      if (this.liangzhang(cards.slice(0, 2)) && this.sanzhang(cards.slice(2))) {
        cards.reverse();
        return 'sandaier';
      }
    }
  },
  feiji: function (cards) {
    // 不带
    // 带单
    // 带双
    return false;
  },
  shunzi: function (cards) {
    // 3 4 5 6 7 8 9 10 11 12 13 1
    if (cards.length >= 5 && cards.length <= 12) {
      if (cards[0].youxian >= 1 && cards[cards.length - 1].youxian <= 12) {
        for (var i = 0; i < cards.length; i++) {
          if ((i != (cards.length - 1)) && (cards[i + 1].youxian - cards[i].youxian != 1)) {
            return false;
          }
        }
        return cards.length + 'shun';
      }
    }
    return false;
  },
  liandui: function (cards) {
    if (cards.length >= 6 && cards.length % 2 == 0) {
      if (cards[0].youxian >= 1 && cards[cards.length - 1].youxian <= 12) {
        for (var i = 0; i < cards.length; i++) {
          if (i % 2 == 0) {
            if (cards[i].youxian != cards[i + 1].youxian) {
              return false;
            }
            if (i < cards.length - 3) {
              if (cards[i + 2].youxian - cards[i].youxian != 1) {
                return false;
              }
            }
          }
        }
        return cards.length / 2 + 'liandui';
      }
    }
    return false;
  },
  zhadan: function (cards) {
    if (cards.length == 4) {
      if (cards[0].number == cards[1].number) {
        if (cards[1].number == cards[2].number) {
          if (cards[2].number == cards[3].number) {
            return 'zhadan';
          }
        }
      }
    }
    return false;
  },
  sidai: function (cards) {
    for (var i = 0, obj = {}; i < cards.length; i++) {
      if (!obj[cards[i].youxian]) {
        obj[cards[i].youxian] = [];
      }
      obj[cards[i].youxian].push(cards[i]);
    }
    if (Object.keys(obj).length == 2) {
      if (cards.length == 6) {
        var arr1 = [];
        var arr2 = [];
        for (var key in obj) {
          if (obj[key].length == 4) {
            arr1 = obj[key];
          } else if (obj[key].length == 2) {
            arr2 = obj[key];
          } else{
            return false;
          }
        }
        cards = arr1.concat(arr2);
        console.log(cards);
        return 'sidaidan';
      }
    }
    if (Object.keys(obj).length == 3) {
      if (cards.length == 6) {
        for (var key in obj) {
          if (obj[key].length == 4) {
            return 'sidaidan';
          }
        }
      } else if (cards.length == 8) {
        for (var key in obj) {
          if (obj[key].length == 4) {

          } else if (obj[key].length == 2) {} else{
            return false;
          }
        }
        return 'sidaidui';
      }
    }
    return false;
  },
  wangzha: function (cards) {
    if (cards.length == 2) {
      if (cards[0].youxian + cards[1].youxian == 29) {
        return 'wangzha';
      }
    }
    return false;
  },
};

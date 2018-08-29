/// <reference path='../node_modules/@types/mocha/index.d.ts' />

import { Tso } from '../src/Tso';
import { FilterClause } from '../src/FilterClause';
import { PrecedenceGroup } from '../src/PrecedenceGroup';
import { Concat } from '../src/Concat';
import * as chai from 'chai';

const expect = chai.expect;

describe('tsdata', () => {
  describe('the constructor', () => {
    it('sets the baseUri', () => {
      let j = new Tso('http://foo.bar');
      expect(j.baseUri).to.equal('http://foo.bar');
    });
  });

  describe('Order By', function() {
    it('should cause an $orderby query string parameter to appear upon toString', function() {
      const j = new Tso('http://foo.bar');
      j.orderBy('baz');

      expect(j.toString()).to.equal('http://foo.bar?$orderby=baz');
    });

    it('allows for desc', function() {
      const j = new Tso('http://foo.bar');
      j.orderBy('baz').desc();

      expect(j.toString()).to.equal('http://foo.bar?$orderby=baz%20desc');
    });

    it('allows for asc', function() {
      const j = new Tso('http://foo.bar');
      j.orderBy('baz').asc();

      expect(j.toString()).to.equal('http://foo.bar?$orderby=baz%20asc');
    });

    it('toggles between orders', function() {
      const j = new Tso('http://foo.bar');
      j.toggleOrderBy('baz');
      expect(j.toString()).to.equal('http://foo.bar?$orderby=baz%20desc');

      j.toggleOrderBy('baz');
      expect(j.toString()).to.equal('http://foo.bar?$orderby=baz%20asc');
    });

    describe('resets to default', function() {
      it('without default order', function() {
        const j = new Tso('http://foo.bar');
        j.setOrderByDefault('CustomerName');

        j.orderBy('OtherValue').asc();
        expect(j.toString()).to.equal(
          'http://foo.bar?$orderby=OtherValue%20asc'
        );

        j.resetOrderBy();
        expect(j.toString()).to.equal(
          'http://foo.bar?$orderby=CustomerName%20desc'
        );
      });

      it('with default order', function() {
        const j = new Tso('http://foo.bar');
        j.setOrderByDefault('CustomerName', 'asc');

        j.orderBy('OtherValue').desc();
        expect(j.toString()).to.equal(
          'http://foo.bar?$orderby=OtherValue%20desc'
        );

        j.resetOrderBy();
        expect(j.toString()).to.equal(
          'http://foo.bar?$orderby=CustomerName%20asc'
        );
      });
    });

    describe('multiple calls', function() {
      it('only keeps the latest of asc or desc', function() {
        const j = new Tso('http://foo.bar');
        j.orderBy('baz')
          .desc()
          .asc()
          .desc()
          .asc();

        expect(j.toString()).to.equal('http://foo.bar?$orderby=baz%20asc');
      });

      it('only keeps the latest of property names', function() {
        const j = new Tso('http://foo.bar');
        j.orderBy('baz').orderBy('two');

        expect(j.toString()).to.equal('http://foo.bar?$orderby=two');
      });
    });
  });
  describe('Top', function() {
    it('should cause a $top query string parameter to appear upon toString', function() {
      const j = new Tso('http://foo.bar');
      j.top(20);

      expect(j.toString()).to.equal('http://foo.bar?$top=20');
    });

    it('has a value of 0', function() {
      const j = new Tso('http://foo.bar');
      j.top(0);

      expect(j.toString()).to.equal('http://foo.bar?$top=0');
    });

    it('has a default', function() {
      const j = new Tso('http://foo.bar');
      j.setTopDefault(10);

      expect(j.toString()).to.equal('http://foo.bar?$top=10');
    });

    it('has a default of 0', function() {
      const j = new Tso('http://foo.bar');
      j.setTopDefault(0);

      expect(j.toString()).to.equal('http://foo.bar?$top=0');
    });

    it('is reset to default', function() {
      const j = new Tso('http://foo.bar');
      j.setTopDefault(10);

      j.top(20);
      expect(j.toString()).to.equal('http://foo.bar?$top=20');

      j.resetTop();
      expect(j.toString()).to.equal('http://foo.bar?$top=10');
    });

    describe('multiple calls', function() {
      it('only keeps the latest top value', function() {
        const j = new Tso('http://foo.bar');
        j.top(10).top(20);

        expect(j.toString()).to.equal('http://foo.bar?$top=20');
      });
    });
  });

  describe('Skip', function() {
    it('should cause a $skip query string parameter to appear upon toString', function() {
      const j = new Tso('http://foo.bar');
      j.skip(20);

      expect(j.toString()).to.equal('http://foo.bar?$skip=20');
    });

    it('has a value of 0', function() {
      const j = new Tso('http://foo.bar');
      j.skip(0);

      expect(j.toString()).to.equal('http://foo.bar?$skip=0');
    });

    it('has a default', function() {
      const j = new Tso('http://foo.bar');
      j.setSkipDefault(10);

      expect(j.toString()).to.equal('http://foo.bar?$skip=10');
    });

    it('has a default of 0', function() {
      const j = new Tso('http://foo.bar');
      j.setSkipDefault(0);

      expect(j.toString()).to.equal('http://foo.bar?$skip=0');
    });

    it('is reset to default', function() {
      const j = new Tso('http://foo.bar');
      j.setSkipDefault(10);

      j.skip(20);
      expect(j.toString()).to.equal('http://foo.bar?$skip=20');

      j.resetSkip();
      expect(j.toString()).to.equal('http://foo.bar?$skip=10');
    });

    describe('multiple calls', function() {
      it('only keeps the latest skip value', function() {
        const j = new Tso('http://foo.bar');
        j.skip(10).skip(20);

        expect(j.toString()).to.equal('http://foo.bar?$skip=20');
      });
    });
  });

  describe('Select', function() {
    it('Joins an array into a $select parameter upon toString', function() {
      const j = new Tso('http://foo.bar');
      j.select(['prop1', 'prop2']);

      expect(j.toString()).to.equal('http://foo.bar?$select=prop1,prop2');
    });

    it('has a default', function() {
      const j = new Tso('http://foo.bar');
      j.setSelectDefault(['prop1', 'prop2']);

      expect(j.toString()).to.equal('http://foo.bar?$select=prop1,prop2');
    });

    it('is reset to default', function() {
      const j = new Tso('http://foo.bar');
      j.setSelectDefault(['prop3', 'prop4']);

      j.select(['prop1', 'prop2']);
      expect(j.toString()).to.equal('http://foo.bar?$select=prop1,prop2');

      j.resetSelect();
      expect(j.toString()).to.equal('http://foo.bar?$select=prop3,prop4');
    });

    describe('multiple calls', function() {
      it('only uses the latest array', function() {
        const j = new Tso('http://foo.bar');
        j.select(['prop1', 'prop2']);
        j.select(['prop3', 'prop4']);

        expect(j.toString()).to.equal('http://foo.bar?$select=prop3,prop4');
      });
    });
  });

  describe('Expand', function() {
    it('should cause an $expand parameter on toString', function() {
      const j = new Tso('http://foo.bar');
      j.expand('Customer');
      expect(j.toString()).to.equal('http://foo.bar?$expand=Customer');
    });

    it('has a default', function() {
      const j = new Tso('http://foo.bar');
      j.setExpandDefault('Customer');
      expect(j.toString()).to.equal('http://foo.bar?$expand=Customer');
    });

    it('is reset to default', function() {
      const j = new Tso('http://foo.bar');
      j.setExpandDefault('Address');

      j.expand('Customer');
      expect(j.toString()).to.equal('http://foo.bar?$expand=Customer');

      j.resetExpand();
      expect(j.toString()).to.equal('http://foo.bar?$expand=Address');
    });
  });

  describe('Format - ', function() {
    it('Atom', function() {
      const j = new Tso('http://foo.bar').format.atom();
      expect(j.toString()).to.equal('http://foo.bar?$format=atom');
    });

    it('Xml', function() {
      const j = new Tso('http://foo.bar').format.xml();
      expect(j.toString()).to.equal('http://foo.bar?$format=xml');
    });

    it('Json', function() {
      const j = new Tso('http://foo.bar').format.json();
      expect(j.toString()).to.equal('http://foo.bar?$format=json');
    });

    it('Custom', function() {
      const j = new Tso('http://foo.bar').format.custom('text/csv');
      expect(j.toString()).to.equal('http://foo.bar?$format=text/csv');
    });

    describe('Default is', function() {
      it('Atom', function() {
        const j = new Tso('http://foo.bar').formatDefault.atom();
        expect(j.toString()).to.equal('http://foo.bar?$format=atom');
      });

      it('Xml', function() {
        const j = new Tso('http://foo.bar').formatDefault.xml();
        expect(j.toString()).to.equal('http://foo.bar?$format=xml');
      });

      it('Json', function() {
        const j = new Tso('http://foo.bar').formatDefault.json();
        expect(j.toString()).to.equal('http://foo.bar?$format=json');
      });

      it('Custom', function() {
        const j = new Tso('http://foo.bar').formatDefault.custom('text/csv');
        expect(j.toString()).to.equal('http://foo.bar?$format=text/csv');
      });
    });

    it('is reset to default', function() {
      const j = new Tso('http://foo.bar').formatDefault.atom();

      j.format.json();
      expect(j.toString()).to.equal('http://foo.bar?$format=json');

      j.resetFormat();
      expect(j.toString()).to.equal('http://foo.bar?$format=atom');
    });

    it('is reset', function() {
      const j = new Tso('http://foo.bar').format.json();
      expect(j.toString()).to.equal('http://foo.bar?$format=json');

      j.resetFormat();
      expect(j.toString()).to.equal('http://foo.bar');
    });
  });

  describe('Inline Count - ', function() {
    it('All Pages', function() {
      const j = new Tso('http://foo.bar').inlineCount.allPages();
      expect(j.toString()).to.equal('http://foo.bar?$inlinecount=allpages');
    });

    it('None', function() {
      const j = new Tso('http://foo.bar').inlineCount.none();
      expect(j.toString()).to.equal('http://foo.bar?$inlinecount=none');
    });

    describe('Default is', function() {
      it('All Pages', function() {
        const j = new Tso('http://foo.bar').inlineCountDefault.allPages();
        expect(j.toString()).to.equal('http://foo.bar?$inlinecount=allpages');
      });

      it('None', function() {
        const j = new Tso('http://foo.bar').inlineCountDefault.none();
        expect(j.toString()).to.equal('http://foo.bar?$inlinecount=none');
      });
    });

    it('is reset to default', function() {
      const j = new Tso('http://foo.bar').inlineCountDefault.none();

      j.inlineCount.allPages();
      expect(j.toString()).to.equal('http://foo.bar?$inlinecount=allpages');

      j.resetInlineCount();
      expect(j.toString()).to.equal('http://foo.bar?$inlinecount=none');
    });

    it('is reset', function() {
      const j = new Tso('http://foo.bar').inlineCount.allPages();
      expect(j.toString()).to.equal('http://foo.bar?$inlinecount=allpages');

      j.resetInlineCount();
      expect(j.toString()).to.equal('http://foo.bar');
    });
  });

  describe('Filter', function() {
    describe('Building and/or Filters', function() {
      it('single filter', function() {
        const j = new Tso('http://foo.bar');
        j.filter(new FilterClause('CustomerId').eq(1));
        expect(j.toString()).to.equal(
          'http://foo.bar?$filter=CustomerId%20eq%201'
        );
      });

      it('multiple and filters', function() {
        const j = new Tso('http://foo.bar');
        j.andFilter(new FilterClause('Property1').eq(5)).andFilter(
          new FilterClause('Property2').eq(10)
        );

        expect(j.toString()).to.equal(
          'http://foo.bar?$filter=Property1%20eq%205%20and%20Property2%20eq%2010'
        );
      });

      it('multiple or filters', function() {
        const j = new Tso('http://foo.bar');
        j.orFilter(new FilterClause('Property1').eq(5)).orFilter(
          new FilterClause('Property2').eq(10)
        );

        expect(j.toString()).to.equal(
          'http://foo.bar?$filter=Property1%20eq%205%20or%20Property2%20eq%2010'
        );
      });

      it('mixing and/or filters', function() {
        const j = new Tso('http://foo.bar');
        j.filter(new FilterClause('p1').eq(1))
          .andFilter(new FilterClause('p2').eq(5))
          .orFilter(new FilterClause('p3').eq(10));

        expect(j.toString()).to.equal(
          'http://foo.bar?$filter=p1%20eq%201%20and%20p2%20eq%205%20or%20p3%20eq%2010'
        );
      });

      describe('Default Filters', function() {
        it('single default filter', function() {
          const j = new Tso('http://foo.bar');
          j.defaultFilter(new FilterClause('CustomerId').eq(1));
          expect(j.toString()).to.equal(
            'http://foo.bar?$filter=CustomerId%20eq%201'
          );
        });

        it('multiple and filters', function() {
          const j = new Tso('http://foo.bar');
          j.defaultAndFilter(
            new FilterClause('Property1').eq(5)
          ).defaultAndFilter(new FilterClause('Property2').eq(10));

          expect(j.toString()).to.equal(
            'http://foo.bar?$filter=Property1%20eq%205%20and%20Property2%20eq%2010'
          );
        });

        it('multiple or filters', function() {
          const j = new Tso('http://foo.bar');
          j.defaultOrFilter(
            new FilterClause('Property1').eq(5)
          ).defaultOrFilter(new FilterClause('Property2').eq(10));

          expect(j.toString()).to.equal(
            'http://foo.bar?$filter=Property1%20eq%205%20or%20Property2%20eq%2010'
          );
        });

        it('mixing and/or filters', function() {
          const j = new Tso('http://foo.bar');
          j.defaultFilter(new FilterClause('p1').eq(1))
            .defaultAndFilter(new FilterClause('p2').eq(5))
            .defaultOrFilter(new FilterClause('p3').eq(10));

          expect(j.toString()).to.equal(
            'http://foo.bar?$filter=p1%20eq%201%20and%20p2%20eq%205%20or%20p3%20eq%2010'
          );
        });

        it('mixing defaults and normal filters', function() {
          const j = new Tso('http://foo.bar');
          j.defaultFilter(new FilterClause('Id').eq(1)).filter(
            new FilterClause('Name').eq('bob')
          );

          expect(j.toString()).to.equal(
            `http://foo.bar?$filter=Id%20eq%201%20and%20Name%20eq%20'bob'`
          );
        });

        it('reset to default filters', function() {
          const j = new Tso('http://foo.bar');
          j.defaultFilter(new FilterClause('Id').eq(1)).filter(
            new FilterClause('Name').eq('bob')
          );

          expect(j.toString()).to.equal(
            `http://foo.bar?$filter=Id%20eq%201%20and%20Name%20eq%20'bob'`
          );

          j.resetFilter();
          expect(j.toString()).to.equal('http://foo.bar?$filter=Id%20eq%201');
        });
      });
    });

    describe('Removing Single Filters', function() {
      it('removing a logical operator filter that is the only filter', function() {
        const j = new Tso('http://foo.bar');
        j.filter(new FilterClause('CustomerName').eq('bob'));
        expect(j.toString()).to.equal(
          `http://foo.bar?$filter=CustomerName%20eq%20'bob'`
        );

        j.removeFilter('CustomerName');
        expect(j.toString()).to.equal('http://foo.bar');
      });

      it('removing a logical operator filter', function() {
        const j = new Tso('http://foo.bar');
        j.filter(new FilterClause('CustomerName').eq('bob')).andFilter(
          new FilterClause('CustomerId').eq(1)
        );

        expect(j.toString()).to.equal(
          `http://foo.bar?$filter=CustomerName%20eq%20'bob'%20and%20CustomerId%20eq%201`
        );

        j.removeFilter('CustomerName');
        expect(j.toString()).to.equal(
          'http://foo.bar?$filter=CustomerId%20eq%201'
        );
      });

      it('removing a arithmetic method filter', function() {
        const j = new Tso('http://foo.bar');
        j.filter(new FilterClause('CustomerName').eq('bob')).andFilter(
          new FilterClause('Price').add(5).eq(1)
        );

        expect(j.toString()).to.equal(
          `http://foo.bar?$filter=CustomerName%20eq%20'bob'%20and%20Price%20add%205%20eq%201`
        );

        j.removeFilter('Price');
        expect(j.toString()).to.equal(
          `http://foo.bar?$filter=CustomerName%20eq%20'bob'`
        );
      });

      it('removing string function filter', function() {
        const j = new Tso('http://foo.bar');
        j.filter(new FilterClause('CustomerName').eq('bob')).andFilter(
          new FilterClause('Title').substringof('bob').eq(true)
        );

        expect(j.toString()).to.equal(
          `http://foo.bar?$filter=CustomerName%20eq%20'bob'%20and%20substringof('bob',Title)%20eq%20true`
        );

        j.removeFilter('Title');
        expect(j.toString()).to.equal(
          `http://foo.bar?$filter=CustomerName%20eq%20'bob'`
        );
      });

      it('removing date function filter', function() {
        const j = new Tso('http://foo.bar');
        j.filter(new FilterClause('CustomerName').eq('bob')).andFilter(
          new FilterClause('Birthday').day().eq(2)
        );

        expect(j.toString()).to.equal(
          `http://foo.bar?$filter=CustomerName%20eq%20'bob'%20and%20day(Birthday)%20eq%202`
        );

        j.removeFilter('Birthday');
        expect(j.toString()).to.equal(
          `http://foo.bar?$filter=CustomerName%20eq%20'bob'`
        );
      });

      it('removing math function filter', function() {
        const j = new Tso('http://foo.bar');
        j.filter(new FilterClause('CustomerName').eq('bob')).andFilter(
          new FilterClause('Price').round().eq(2)
        );

        expect(j.toString()).to.equal(
          `http://foo.bar?$filter=CustomerName%20eq%20'bob'%20and%20round(Price)%20eq%202`
        );

        j.removeFilter('Price');
        expect(j.toString()).to.equal(
          `http://foo.bar?$filter=CustomerName%20eq%20'bob'`
        );
      });
    });

    describe('Type Casts', function() {
      it('cast to datetime', function() {
        const j = new Tso('http://foo.bar');
        j.filter(new FilterClause('DateAdded').eq(Tso.datetime('13-03-01')));
        expect(j.toString()).to.equal(
          `http://foo.bar?$filter=DateAdded%20eq%20datetime'13-03-01'`
        );
      });

      it('cast to decimal', function() {
        const j = new Tso('http://foo.bar');
        j.filter(new FilterClause('Price').eq(Tso.decimal(392.52)));
        expect(j.toString()).to.equal(
          'http://foo.bar?$filter=Price%20eq%20392.52m'
        );
      });

      it('cast to guid', function() {
        const j = new Tso('http://foo.bar');
        j.filter(
          new FilterClause('CustomerGuid').eq(
            Tso.guid('1225c695-cfb8-4ebb-aaaa-80da344efa6a')
          )
        );
        expect(j.toString()).to.equal(
          `http://foo.bar?$filter=CustomerGuid%20eq%20guid'1225c695-cfb8-4ebb-aaaa-80da344efa6a'`
        );
      });

      it('cast to v4guid', function() {
        const j = new Tso('http://foo.bar');
        j.filter(
          new FilterClause('CustomerGuid').eq(
            Tso.v4guid('1225c695-cfb8-4ebb-aaaa-80da344efa6a')
          )
        );
        expect(j.toString()).to.equal(
          'http://foo.bar?$filter=CustomerGuid%20eq%201225c695-cfb8-4ebb-aaaa-80da344efa6a'
        );
      });

      it('cast to single', function() {
        const j = new Tso('http://foo.bar');
        j.filter(new FilterClause('Price').eq(Tso.single(392.52)));
        expect(j.toString()).to.equal(
          'http://foo.bar?$filter=Price%20eq%20392.52f'
        );
      });

      it('cast to double', function() {
        const j = new Tso('http://foo.bar');
        j.filter(new FilterClause('Price').eq(Tso.double(392.52)));
        expect(j.toString()).to.equal(
          'http://foo.bar?$filter=Price%20eq%20392.52d'
        );
      });

      it('string that ends with m', function() {
        const j = new Tso('http://foo.bar');
        j.filter(new FilterClause('Currency').eq('slurm'));
        expect(j.toString()).to.equal(
          `http://foo.bar?$filter=Currency%20eq%20'slurm'`
        );
      });

      it('string that ends with f', function() {
        const j = new Tso('http://foo.bar');
        j.filter(new FilterClause('Currency').eq('stuff'));
        expect(j.toString()).to.equal(
          `http://foo.bar?$filter=Currency%20eq%20'stuff'`
        );
      });

      it('string that ends with d', function() {
        const j = new Tso('http://foo.bar');
        j.filter(new FilterClause('Currency').eq('usd'));
        expect(j.toString()).to.equal(
          `http://foo.bar?$filter=Currency%20eq%20'usd'`
        );
      });
    });

    describe('Logical Operators', function() {
      it('Equals - string', function() {
        const j = new Tso('http://foo.bar');
        j.filter(new FilterClause('CustomerName').eq('bob'));
        expect(j.toString()).to.equal(
          `http://foo.bar?$filter=CustomerName%20eq%20'bob'`
        );
      });

      it('Equals - number', function() {
        const j = new Tso('http://foo.bar');
        j.filter(new FilterClause('CustomerId').eq(1));
        expect(j.toString()).to.equal(
          'http://foo.bar?$filter=CustomerId%20eq%201'
        );
      });

      it('Equals - boolean', function() {
        const j = new Tso('http://foo.bar');
        j.filter(new FilterClause('IsCustomer').eq(true));
        expect(j.toString()).to.equal(
          'http://foo.bar?$filter=IsCustomer%20eq%20true'
        );
      });

      it('Not Equals - string', function() {
        const j = new Tso('http://foo.bar');
        j.filter(new FilterClause('CustomerName').ne('bob'));
        expect(j.toString()).to.equal(
          `http://foo.bar?$filter=CustomerName%20ne%20'bob'`
        );
      });

      it('Not Equals - number', function() {
        const j = new Tso('http://foo.bar');
        j.filter(new FilterClause('CustomerId').ne(1));
        expect(j.toString()).to.equal(
          'http://foo.bar?$filter=CustomerId%20ne%201'
        );
      });

      it('Not Equals - boolean', function() {
        const j = new Tso('http://foo.bar');
        j.filter(new FilterClause('IsCustomer').ne(true));
        expect(j.toString()).to.equal(
          'http://foo.bar?$filter=IsCustomer%20ne%20true'
        );
      });

      it('Greater Than - string', function() {
        const j = new Tso('http://foo.bar');
        j.filter(new FilterClause('CustomerName').gt('bob'));
        expect(j.toString()).to.equal(
          `http://foo.bar?$filter=CustomerName%20gt%20'bob'`
        );
      });

      it('Greater Than - number', function() {
        const j = new Tso('http://foo.bar');
        j.filter(new FilterClause('CustomerId').gt(1));
        expect(j.toString()).to.equal(
          'http://foo.bar?$filter=CustomerId%20gt%201'
        );
      });

      it('Greater Than - boolean', function() {
        const j = new Tso('http://foo.bar');
        j.filter(new FilterClause('IsCustomer').gt(true));
        expect(j.toString()).to.equal(
          'http://foo.bar?$filter=IsCustomer%20gt%20true'
        );
      });

      it('Greater Than or Equal - string', function() {
        const j = new Tso('http://foo.bar');
        j.filter(new FilterClause('CustomerName').ge('bob'));
        expect(j.toString()).to.equal(
          `http://foo.bar?$filter=CustomerName%20ge%20'bob'`
        );
      });

      it('Greater Than or Equal - number', function() {
        const j = new Tso('http://foo.bar');
        j.filter(new FilterClause('CustomerId').ge(1));
        expect(j.toString()).to.equal(
          'http://foo.bar?$filter=CustomerId%20ge%201'
        );
      });

      it('Greater Than or Equal - boolean', function() {
        const j = new Tso('http://foo.bar');
        j.filter(new FilterClause('IsCustomer').ge(true));
        expect(j.toString()).to.equal(
          'http://foo.bar?$filter=IsCustomer%20ge%20true'
        );
      });

      it('Less Than - string', function() {
        const j = new Tso('http://foo.bar');
        j.filter(new FilterClause('CustomerName').lt('bob'));
        expect(j.toString()).to.equal(
          `http://foo.bar?$filter=CustomerName%20lt%20'bob'`
        );
      });

      it('Less Than - number', function() {
        const j = new Tso('http://foo.bar');
        j.filter(new FilterClause('CustomerId').lt(1));
        expect(j.toString()).to.equal(
          'http://foo.bar?$filter=CustomerId%20lt%201'
        );
      });

      it('Less Than - boolean', function() {
        const j = new Tso('http://foo.bar');
        j.filter(new FilterClause('IsCustomer').lt(true));
        expect(j.toString()).to.equal(
          'http://foo.bar?$filter=IsCustomer%20lt%20true'
        );
      });

      it('Less Than or Equal - string', function() {
        const j = new Tso('http://foo.bar');
        j.filter(new FilterClause('CustomerName').le('bob'));
        expect(j.toString()).to.equal(
          `http://foo.bar?$filter=CustomerName%20le%20'bob'`
        );
      });

      it('Less Than or Equal - number', function() {
        const j = new Tso('http://foo.bar');
        j.filter(new FilterClause('CustomerId').le(1));
        expect(j.toString()).to.equal(
          'http://foo.bar?$filter=CustomerId%20le%201'
        );
      });

      it('Less Than or Equal - boolean', function() {
        const j = new Tso('http://foo.bar');
        j.filter(new FilterClause('IsCustomer').le(true));
        expect(j.toString()).to.equal(
          'http://foo.bar?$filter=IsCustomer%20le%20true'
        );
      });

      it('Not - non boolean statement', function() {
        const j = new Tso('http://foo.bar');
        j.filter(new FilterClause('CustomerName').not().eq('bob'));
        expect(j.toString()).to.equal(
          `http://foo.bar?$filter=not%20(CustomerName%20eq%20'bob')`
        );
      });

      it('Not - boolean statement', function() {
        const j = new Tso('http://foo.bar');
        j.filter(new FilterClause('CustomerName').not().endswith('bob'));
        expect(j.toString()).to.equal(
          `http://foo.bar?$filter=not%20endswith(CustomerName,'bob')`
        );
      });
    });

    describe('Precedence Groups', function() {
      it('creating a precedence group', function() {
        const j = new Tso('http://foo.bar');
        const group = new PrecedenceGroup(new FilterClause('Name').eq('Bob'));
        j.filter(group);
        expect(j.toString()).to.equal(
          `http://foo.bar?$filter=(Name%20eq%20'Bob')`
        );
      });

      it('and/or with precedence groups', function() {
        const j = new Tso('http://foo.bar');
        const group = new PrecedenceGroup(
          new FilterClause('Name').eq('Bob')
        ).orFilter(new FilterClause('Name').eq('George'));
        j.filter(group);

        expect(j.toString()).to.equal(
          `http://foo.bar?$filter=(Name%20eq%20'Bob'%20or%20Name%20eq%20'George')`
        );
      });

      it('mixing precedence groups', function() {
        const j = new Tso('http://foo.bar');
        j.filter(new FilterClause('Id').eq(1)).andFilter(
          new PrecedenceGroup(
            new FilterClause('Name').startswith('a').eq(true)
          ).orFilter(new FilterClause('Name').startswith('b').eq(true))
        );

        expect(j.toString()).to.equal(
          `http://foo.bar?$filter=Id%20eq%201%20and%20(startswith(Name,'a')%20eq%20true%20or%20startswith(Name,'b')%20eq%20true)`
        );
      });
    });

    describe('Arithmetic Methods', function() {
      it('Add', function() {
        const j = new Tso('http://foo.bar');
        j.filter(new FilterClause('Price').add(5).eq(10));
        expect(j.toString()).to.equal(
          'http://foo.bar?$filter=Price%20add%205%20eq%2010'
        );
      });

      it('Sub', function() {
        const j = new Tso('http://foo.bar');
        j.filter(new FilterClause('Price').sub(5).eq(10));
        expect(j.toString()).to.equal(
          'http://foo.bar?$filter=Price%20sub%205%20eq%2010'
        );
      });

      it('Mul', function() {
        const j = new Tso('http://foo.bar');
        j.filter(new FilterClause('Price').mul(5).eq(10));
        expect(j.toString()).to.equal(
          'http://foo.bar?$filter=Price%20mul%205%20eq%2010'
        );
      });

      it('Div', function() {
        const j = new Tso('http://foo.bar');
        j.filter(new FilterClause('Price').div(5).eq(10));
        expect(j.toString()).to.equal(
          'http://foo.bar?$filter=Price%20div%205%20eq%2010'
        );
      });

      it('Mod', function() {
        const j = new Tso('http://foo.bar');
        j.filter(new FilterClause('Price').mod(5).eq(10));
        expect(j.toString()).to.equal(
          'http://foo.bar?$filter=Price%20mod%205%20eq%2010'
        );
      });
    });

    describe('String Functions', function() {
      it('Substringof', function() {
        const j = new Tso('http://foo.bar');
        j.filter(new FilterClause('PropertyName').substringof('test').eq(true));
        expect(j.toString()).to.equal(
          `http://foo.bar?$filter=substringof('test',PropertyName)%20eq%20true`
        );
      });

      it('Substringof - with toLower', function() {
        const j = new Tso('http://foo.bar');
        j.filter(
          new FilterClause('PropertyName')
            .toLower()
            .substringof('test')
            .eq(true)
        );
        expect(j.toString()).to.equal(
          `http://foo.bar?$filter=substringof('test',tolower(PropertyName))%20eq%20true`
        );
      });

      it('Substringof - with toUpper', function() {
        const j = new Tso('http://foo.bar');
        j.filter(
          new FilterClause('PropertyName')
            .toUpper()
            .substringof('test')
            .eq(true)
        );
        expect(j.toString()).to.equal(
          `http://foo.bar?$filter=substringof('test',toupper(PropertyName))%20eq%20true`
        );
      });

      it('Substringof - with trim', function() {
        const j = new Tso('http://foo.bar');
        j.filter(
          new FilterClause('PropertyName')
            .trim()
            .substringof('test')
            .eq(true)
        );
        expect(j.toString()).to.equal(
          `http://foo.bar?$filter=substringof('test',trim(PropertyName))%20eq%20true`
        );
      });

      it('Endswith', function() {
        const j = new Tso('http://foo.bar');
        j.filter(new FilterClause('PropertyName').endswith('test').eq(true));
        expect(j.toString()).to.equal(
          `http://foo.bar?$filter=endswith(PropertyName,'test')%20eq%20true`
        );
      });

      it('Startswith', function() {
        const j = new Tso('http://foo.bar');
        j.filter(new FilterClause('PropertyName').startswith('test').eq(true));
        expect(j.toString()).to.equal(
          `http://foo.bar?$filter=startswith(PropertyName,'test')%20eq%20true`
        );
      });

      it('Contains', function() {
        const j = new Tso('http://foo.bar');
        j.filter(new FilterClause('PropertyName').contains('test').eq(true));
        expect(j.toString()).to.equal(
          `http://foo.bar?$filter=contains(PropertyName,'test')%20eq%20true`
        );
      });

      it('Length', function() {
        const j = new Tso('http://foo.bar');
        j.filter(new FilterClause('PropertyName').length().eq(10));
        expect(j.toString()).to.equal(
          'http://foo.bar?$filter=length(PropertyName)%20eq%2010'
        );
      });

      it('Indexof', function() {
        const j = new Tso('http://foo.bar');
        j.filter(new FilterClause('PropertyName').indexof('test').eq(1));
        expect(j.toString()).to.equal(
          `http://foo.bar?$filter=indexof(PropertyName,'test')%20eq%201`
        );
      });

      it('Replace', function() {
        const j = new Tso('http://foo.bar');
        j.filter(
          new FilterClause('PropertyName').replace('test', 'bob').eq('bob')
        );
        expect(j.toString()).to.equal(
          `http://foo.bar?$filter=replace(PropertyName,'test','bob')%20eq%20'bob'`
        );
      });

      it('Substring - without length', function() {
        const j = new Tso('http://foo.bar');
        j.filter(new FilterClause('PropertyName').substring(1).eq('test'));
        expect(j.toString()).to.equal(
          `http://foo.bar?$filter=substring(PropertyName,1)%20eq%20'test'`
        );
      });
      it('Substring - with length', function() {
        const j = new Tso('http://foo.bar');
        j.filter(new FilterClause('PropertyName').substring(1, 2).eq('test'));
        expect(j.toString()).to.equal(
          `http://foo.bar?$filter=substring(PropertyName,1,2)%20eq%20'test'`
        );
      });

      it('To Lower', function() {
        const j = new Tso('http://foo.bar');
        j.filter(new FilterClause('PropertyName').toLower().eq('test'));
        expect(j.toString()).to.equal(
          `http://foo.bar?$filter=tolower(PropertyName)%20eq%20'test'`
        );
      });

      it('To Upper', function() {
        const j = new Tso('http://foo.bar');
        j.filter(new FilterClause('PropertyName').toUpper().eq('TEST'));
        expect(j.toString()).to.equal(
          `http://foo.bar?$filter=toupper(PropertyName)%20eq%20'TEST'`
        );
      });

      it('Trim', function() {
        const j = new Tso('http://foo.bar');
        j.filter(new FilterClause('PropertyName').trim().eq('test'));
        expect(j.toString()).to.equal(
          `http://foo.bar?$filter=trim(PropertyName)%20eq%20'test'`
        );
      });
    });

    describe('Concatenation', function() {
      it('with nesting', function() {
        const j = new Tso('http://foo.bar');
        j.filter(
          new FilterClause('')
            .Concat(new Concat('FirstName', 'LastName'))
            .eq('BobSmith')
        );
        expect(j.toString()).to.equal(
          `http://foo.bar?$filter=concat(FirstName,LastName)%20eq%20'BobSmith'`
        );
      });

      it('with nesting', function() {
        const j = new Tso('http://foo.bar');
        j.filter(
          new FilterClause('')
            .Concat(new Concat(new Concat('City', Tso.literal(', ')), 'State'))
            .eq('Birmingham, Alabama')
        );
        expect(j.toString()).to.equal(
          `http://foo.bar?$filter=concat(concat(City,',%20'),State)%20eq%20'Birmingham,%20Alabama'`
        );
      });
    });

    describe('Date Functions', function() {
      it('Day', function() {
        const j = new Tso('http://foo.bar');
        j.filter(new FilterClause('Birthday').day().eq(2));
        expect(j.toString()).to.equal(
          'http://foo.bar?$filter=day(Birthday)%20eq%202'
        );
      });

      it('Hour', function() {
        const j = new Tso('http://foo.bar');
        j.filter(new FilterClause('Birthday').hour().eq(2));
        expect(j.toString()).to.equal(
          'http://foo.bar?$filter=hour(Birthday)%20eq%202'
        );
      });

      it('Minute', function() {
        const j = new Tso('http://foo.bar');
        j.filter(new FilterClause('Birthday').minute().eq(2));
        expect(j.toString()).to.equal(
          'http://foo.bar?$filter=minute(Birthday)%20eq%202'
        );
      });

      it('Month', function() {
        const j = new Tso('http://foo.bar');
        j.filter(new FilterClause('Birthday').month().eq(2));
        expect(j.toString()).to.equal(
          'http://foo.bar?$filter=month(Birthday)%20eq%202'
        );
      });

      it('Second', function() {
        const j = new Tso('http://foo.bar');
        j.filter(new FilterClause('Birthday').second().eq(2));
        expect(j.toString()).to.equal(
          'http://foo.bar?$filter=second(Birthday)%20eq%202'
        );
      });

      it('Year', function() {
        const j = new Tso('http://foo.bar');
        j.filter(new FilterClause('Birthday').year().eq(2));
        expect(j.toString()).to.equal(
          'http://foo.bar?$filter=year(Birthday)%20eq%202'
        );
      });
    });

    describe('Math Functions', function() {
      it('Round', function() {
        const j = new Tso('http://foo.bar');
        j.filter(new FilterClause('Price').round().eq(2));
        expect(j.toString()).to.equal(
          'http://foo.bar?$filter=round(Price)%20eq%202'
        );
      });

      it('Floor', function() {
        const j = new Tso('http://foo.bar');
        j.filter(new FilterClause('Price').floor().eq(2));
        expect(j.toString()).to.equal(
          'http://foo.bar?$filter=floor(Price)%20eq%202'
        );
      });

      it('Ceiling', function() {
        const j = new Tso('http://foo.bar');
        j.filter(new FilterClause('Price').ceiling().eq(2));
        expect(j.toString()).to.equal(
          'http://foo.bar?$filter=ceiling(Price)%20eq%202'
        );
      });
    });

    describe('Capture Filter', function() {
      it('Apply Filter, then capture, add more filters, then reset to capture', function() {
        const j = new Tso('http://foo.bar');
        j.filter(new FilterClause('Status').eq('Pending'));
        expect(j.toString()).to.equal(
          `http://foo.bar?$filter=Status%20eq%20'Pending'`
        );

        j.captureFilter();
        j.andFilter(new FilterClause('Name').eq('Chris'));
        expect(j.toString()).to.equal(
          `http://foo.bar?$filter=Status%20eq%20'Pending'%20and%20Name%20eq%20'Chris'`
        );

        j.resetToCapturedFilter();
        expect(j.toString()).to.equal(
          `http://foo.bar?$filter=Status%20eq%20'Pending'`
        );
      });

      it('Apply Filter, then capture, add more filters, then do a full reset', function() {
        const j = new Tso('http://foo.bar');
        j.filter(new FilterClause('Status').eq('Pending'));
        expect(j.toString()).to.equal(
          `http://foo.bar?$filter=Status%20eq%20'Pending'`
        );

        j.captureFilter();
        j.andFilter(new FilterClause('Name').eq('Chris'));
        expect(j.toString()).to.equal(
          `http://foo.bar?$filter=Status%20eq%20'Pending'%20and%20Name%20eq%20'Chris'`
        );

        j.resetFilter();
        expect(j.toString()).to.equal('http://foo.bar');
      });
    });
  });
});

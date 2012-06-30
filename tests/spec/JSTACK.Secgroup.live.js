describe("JSTACK Security Group", function() {

	
	beforeEach(function() {
		this.url = 'http://178.239.138.10:5000/v2.0/'
		JSTACK.Keystone.init(this.url)
		var username = 'pfedkow';
		var password = 'dopal4mi';
        var tenant = 'd9a0f593e31f4b96b6488292353f7f15';
        var _ok = function () {
        };
        var _err = function () {
        };
		JSTACK.Keystone.authenticate(username, password, undefined, tenant, _ok, _err);
        JSTACK.Keystone.params.region = 'r4cz1';
        waitsFor(function() { if(JSTACK.Keystone.STATES.AUTHENTICATED ==  JSTACK.Keystone.params.currentstate) return true; return false; }, "Keystone authetication never completed", 2000);
	});


	it("Should return security group list.", function() {
        var secGroupList = undefined;
        runs( function() {
                JSTACK.Nova.getsecgrouplist(function(result) { secGroupList = result;});
            });
        waitsFor(function() { if(secGroupList != undefined && secGroupList.security_groups != undefined) return true; return false; }, "Keystone authetication never completed", 2000);
	});

	it("Should create and delete security group model along with security rules", function() {
        var secgroup = new SecGroup();
        var destroyed = false;
        var sgdestroyed = false;
        var secgrouprule = new SecGroupRule();
//security group
        runs( function() {
                secgroup.set({"name":"testowy-sec-grup", "description":"test"});
                secgroup.save(undefined, {success: function(model,response){ model.set(response.security_group); }});
            });
        waitsFor(function() { if(secgroup.get("id") != undefined) return true; return false; }, "Security group creation never completed", 2000);

//security rule
        runs( function() {
                secgrouprule.set({"from_port":25,"to_port":25,"ip_protocol":"tcp","parent_group_id":secgroup.get("id"),"cidr":"0.0.0.0/0"});
                secgrouprule.save(undefined, {success: function(model,response) { model.set({id:response.security_group_rule.id}); }});
            });
        waitsFor(function() { if(secgrouprule.get("id") != undefined) return true; return false; }, "Security group rule creation never completed", 2000);

//security rule deletion
        runs ( function() {
                secgrouprule.destroy({success: function(model, response) { sgdestroyed = true; }});
            });
        waitsFor(function() { return(sgdestroyed); }, "Security group rule deletion never completed", 2000);
//security group deletion
        runs( function() {
                secgroup.destroy({success: function(model, response) { destroyed = true; }});
            });
        waitsFor(function() { return(destroyed); }, "Security group deletion never completed", 2000);
    });

});

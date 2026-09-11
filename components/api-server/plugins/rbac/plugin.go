package rbac

import (
	"os"
	"strings"

	"github.com/gorilla/mux"

	"github.com/openshift-online/hypershell/components/api-server/pkg/rbac"
	"github.com/openshift-online/hypershell/components/api-server/plugins/roleBindings"
	"github.com/openshift-online/hypershell/components/api-server/plugins/users"
	"github.com/openshift-online/rh-trex-ai/pkg/auth"
	"github.com/openshift-online/rh-trex-ai/pkg/environments"
	pkgserver "github.com/openshift-online/rh-trex-ai/pkg/server"
)

func parseServiceAccountsFromEnv() []string {
	raw := os.Getenv("RBAC_SERVICE_ACCOUNTS")
	if raw == "" {
		return nil
	}
	var serviceAccounts []string
	for _, entry := range strings.Split(raw, ",") {
		if trimmed := strings.TrimSpace(entry); trimmed != "" {
			serviceAccounts = append(serviceAccounts, trimmed)
		}
	}
	return serviceAccounts
}

func init() {
	pkgserver.RegisterRoutes("rbac", func(apiV1Router *mux.Router, services pkgserver.ServicesInterface, authMiddleware environments.JWTMiddleware, authzMiddleware auth.AuthorizationMiddleware) {
		envServices := services.(*environments.Services)

		userService := users.Service(envServices)
		rbService := roleBindings.Service(envServices)

		if userService != nil {
			provisioner := rbac.NewUserProvisioner(
				userService,
				userService,
				parseServiceAccountsFromEnv(),
			)
			var syncer rbac.JWTRoleSyncer
			if rbService != nil {
				syncer = rbService
			}
			apiV1Router.Use(rbac.UserProvisioningMiddleware(provisioner, syncer))
		}
		if rbService != nil {
			enforceRBAC := os.Getenv("RBAC_ENFORCE") == "true"
			authzConfig := rbac.AuthzConfig{
				EnforceRBAC: enforceRBAC,
			}
			rbacMiddleware := rbac.NewRBACAuthzMiddleware(rbService, authzConfig)
			apiV1Router.Use(rbacMiddleware.AuthorizeApi)
		}
	})
}

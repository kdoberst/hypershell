package rbac

import (
	"context"
	"strings"

	"github.com/golang/glog"

	"github.com/openshift-online/rh-trex-ai/pkg/auth"
)

type UserUpserter interface {
	UpsertByUsername(ctx context.Context, username string, email *string, name *string) (userID string, err error)
}

type LoginRecorder interface {
	RecordLogin(ctx context.Context, userID string) error
}

type defaultUserProvisioner struct {
	upserter        UserUpserter
	loginRecorder   LoginRecorder
	serviceAccounts []string
}

var _ UserProvisioner = &defaultUserProvisioner{}

func NewUserProvisioner(upserter UserUpserter, loginRecorder LoginRecorder, serviceAccounts []string) UserProvisioner {
	return &defaultUserProvisioner{
		upserter:        upserter,
		loginRecorder:   loginRecorder,
		serviceAccounts: serviceAccounts,
	}
}

func (p *defaultUserProvisioner) UpsertFromJWT(ctx context.Context, payload *auth.Payload) (string, error) {
	var email *string
	if payload.Email != "" {
		email = &payload.Email
	}

	var name *string
	fullName := strings.TrimSpace(payload.FirstName + " " + payload.LastName)
	if fullName != "" {
		name = &fullName
	}

	userID, err := p.upserter.UpsertByUsername(ctx, payload.Username, email, name)
	if err != nil {
		return "", err
	}

	if isServiceAccount(payload.Username, p.serviceAccounts) {
		return userID, nil
	}

	if p.loginRecorder != nil {
		if recordErr := p.loginRecorder.RecordLogin(ctx, userID); recordErr != nil {
			glog.Warningf("record login failed for user %q: %v", userID, recordErr)
		}
	}

	return userID, nil
}

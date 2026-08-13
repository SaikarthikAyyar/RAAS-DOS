// ====================================
// BUILD ACTOR
// Shared shape for the "actor" field every Business Masters mutating
// request carries (matches backend ActorSchema). Mirrors the inline
// pattern already established in AdministrationUsers.jsx.
// ====================================

export function buildActor(user){

    if(!user){
        return null;
    }

    return {
        user_id: user.id,
        name: user.name,
        role: user.role
    };

}

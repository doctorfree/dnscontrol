var DSP_CLOUDFLARE = NewDnsProvider('cloudflare');
var REG_NONE = NewRegistrar('none');

D('neoman.dev', REG_NONE, DnsProvider(DSP_CLOUDFLARE),
    A('@', '185.199.111.153', CF_PROXY_ON),
    A('@', '185.199.110.153', CF_PROXY_ON),
    A('@', '185.199.109.153', CF_PROXY_ON),
    A('@', '185.199.108.153', CF_PROXY_ON),
	  A('arch', '67.180.229.153'),
	  A('fedora', '67.180.229.153'),
	  A('kasm', '10.0.1.120'),
    A('ronnie', '67.180.229.153'),
    CNAME('_domainconnect', 'connect.domains.google.com.', CF_PROXY_ON),
	  CNAME('kasmweb', '23381d9b-272d-4418-966e-69a88080f321.cfargotunnel.com.', CF_PROXY_ON),
    CNAME('readme', 'doctorfree.github.io.', CF_PROXY_ON),
    CNAME('www', 'doctorfree.github.io.', CF_PROXY_ON),
    MX('@', 40, 'alt4.gmr-smtp-in.l.google.com.', TTL(3600)),
    MX('@', 30, 'alt3.gmr-smtp-in.l.google.com.', TTL(3600)),
    MX('@', 20, 'alt2.gmr-smtp-in.l.google.com.', TTL(3600)),
    MX('@', 10, 'alt1.gmr-smtp-in.l.google.com.', TTL(3600)),
    MX('@', 5, 'gmr-smtp-in.l.google.com.', TTL(3600)),
    TXT('_github-pages-challenge-doctorfree', 'c258dc119431ba55f44a68878d88b1'),
    TXT('@', 'google-site-verification=1gv0rI-PWeL5b15TgaOJHJxklE-BY0iDgqz2dbbK0z8'),
	  TXT('_acme-challenge', 'fYs1YgM1Ch2qnsPmUbnuuLDqmgak5nGk1I424JRPBso'),
    // Not doing this yet
    // CAA_BUILDER({
    //   label: '@',
    //   iodef: 'ronaldrecord@gmail.com',
    //   iodef_critical: true,
    //   issue: [
    //     'letsencrypt.org',
    //     'comodoca.com',
    //   ],
    //   issuewild: [
    //     'letsencrypt.org',
    //   ],
    // }),
    DMARC_BUILDER({
        policy: 'reject',
        subdomainPolicy: 'reject',
        percent: 100,
        alignmentSPF: 'relaxed',
        alignmentDKIM: 'relaxed',
        rua: [
            'mailto:bp3lpit8@ag.us.dmarcian.com'
        ],
        ruf: [
            'mailto:bp3lpit8@fr.us.dmarcian.com'
        ],
    }),
    SPF_BUILDER({
        label: '@',
        overflow: "_spf%d",
        raw: "_rawspf",
        parts: [
            "v=spf1",
            "+a",
            "+mx",
            "+a:gmr-smtp-in.l.google.com",
            "~all"
        ]
    })
)
